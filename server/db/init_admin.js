// seed.js
const connectDB = require('./client');
const User = require('./models/user');

const createInitialUser = async () => {
  await connectDB();

  const exists = await User.findOne({ email: 'admin@drivncook.fr' });
  if (exists) {
    console.log('L’utilisateur admin existe déjà');
    return process.exit(0);
  }

  const adminUser = new User({
    name: 'admin',
    email: 'admin@drivncook.fr',
    password: 'admin',
    role: 'admin',
  });

  await adminUser.save();
  console.log('Utilisateur admin créé');
  process.exit(0);
};

createInitialUser();
