const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const { connectToServer } = require('./utils/dbConnects')
const cookieParser = require('cookie-parser')
const corsOption = require('./config/cors_option')
const port = process.env.PORT || 7071
const authRoute = require('./routes/authRoutes')
const teacherManager = require('./routes/teacherManager')
const studentManager = require('./routes/studentManager')
const dashManager = require('./routes/dashManager')
const committeManager = require('./routes/committeManager')



app.use(cors())
// app.use(cors(corsOption))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())



connectToServer()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running at port: ${port}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });


app.use('/auth'     , authRoute)
app.use('/teacher'  , teacherManager)
app.use('/student'  , studentManager)
app.use('/member' , committeManager)
app.use('/dash'     , dashManager)



app.get('/', (req,res) => {
    res.status(200).json({message:`Server responded successfully!`})
})

app.all('*', async(req,res) =>{
    res.status(404).json({ message: "Cann't find the requested route!" })
})