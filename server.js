const express = require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const app = express()

// Loading 
require('dotenv').config({ path: './.env' })

// New Method
app.use(methodOverride('_method'))

// Connecting to Local Database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (error) => {
    if (error) {
        console.log(error)
    } else console.log('Succesfully Connected to Database')
})

// View Engine and Layout
app.use(expressEjsLayouts)
app.set('layout', 'layouts/main')
app.set('view engine', 'ejs')

// Routes
app.get('/', (req, res) => [
    res.render('index')
])
app.use('/articles', require('./routes/articles'))

// Port
app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log(`Server running on Port ${process.env.PORT}`)
    }
})