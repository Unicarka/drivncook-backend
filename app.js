const express = require('express')
const app = express()
const connectDB = require('./server/db/client')
connectDB()

const userRoutes = require('./server/routes/userRoutes')

app.use(express.json())

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/users', userRoutes)

app.listen('8000', () => {
    console.log('Server is running on localhost:8000');
})
