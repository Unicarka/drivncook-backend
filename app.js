const express = require('express')
const cors = require('cors')
const app = express()
const userRoutes = require('./server/routes/userRoutes')
const truckRoutes = require('./server/routes/truckRoutes')
const stripeRoutes = require('./server/routes/stripeRoutes')
const foodRoutes = require('./server/routes/foodRoutes')

const connectDB = require('./server/db/client')
connectDB()

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use('/stripe', stripeRoutes)
app.use(express.json())

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/users', userRoutes)
app.use('/trucks', truckRoutes)
app.use('/food', foodRoutes)

app.listen('8000', () => {
    console.log('Server is running on localhost:8000');
})
