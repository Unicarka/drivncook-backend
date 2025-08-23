// seed.js
const connectDB = require('./client');
const User = require('./models/user');
const Parking = require('./models/parking');
const ParkingSpot = require('./models/parkingSpot');

const createInitialUser = async () => {
  await connectDB();

  const exists = await User.findOne({ email: 'admin@drivncook.fr' });
  if (!exists) {
    const adminUser = new User({
      name: 'admin',
      email: 'admin@drivncook.fr',
      password: 'admin',
      role: 'admin',
    });
    
    await adminUser.save();
    console.log('Utilisateur admin créé');
  } else {
    console.log('L’utilisateur admin existe déjà');
  }
};

const createParkings = async () => {
  await connectDB();

  const PARKINGS = [
    { name: 'Paris Nord', code: 'PNORD', address: 'La Plaine Saint-Denis, 93210' },
    { name: 'Paris Sud', code: 'PSUD', address: 'Massy, 91300' },
    { name: 'Paris Est', code: 'PEST', address: 'Noisy-le-Grand, 93160' },
    { name: 'Paris Ouest', code: 'POUEST', address: 'Nanterre, 92000' },
  ];

  for (const p of PARKINGS) {
    let parking = await Parking.findOne({ code: p.code });
    if (!parking) {
      parking = await Parking.create({ ...p, capacity: 100 });
      console.log(`Parking created : ${parking.name}`);
    } else {
      console.log(`Parking already exists : ${parking.name}`);
    }

    const existingCount = await ParkingSpot.countDocuments({ parking: parking._id });
    if (existingCount < 100) {
      const missing = [];
      const existingNumbers = new Set(
        (await ParkingSpot.find({ parking: parking._id }, { number: 1 })).map(s => s.number)
      );
      for (let n = 1; n <= 100; n++) {
        if (!existingNumbers.has(n)) missing.push({ parking: parking._id, number: n });
      }
      if (missing.length) {
        await ParkingSpot.insertMany(missing);
        console.log(`${missing.length} spots added for ${parking.name}`);
      }
    } else {
      console.log(`100 spots OK for ${parking.name}`);
    }
  }

  console.log('Parkings and spots created.');
  process.exit(0);
};

const main = async () => {
  await createInitialUser();
  await createParkings();
}

main();
