const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stateController = require('./Controller/StateController');
const teacherController = require('./Controller/TeacherConroller');
const studentController = require('./Controller/StudentController');
const homeController = require('./Controller/HomeController');
const auth = require('./Middleware/auth');
const verifyRole = require('./Middleware/authorization');

const app = express();
const PORT = 5001 || process.env.PORT;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}))

//inital controller endpoins here
app.use('/state',stateController);
app.use('/teacher',auth,verifyRole('TEACHER'),teacherController);
app.use('/student',auth,verifyRole('STUDENT'),studentController);
app.use('/',homeController);


mongoose.connect('mongodb://localhost:27017/ustaad').then(()=>{
    console.log(`Database connected at 27017 port`)
}).catch((err) => {
    console.log(`Error is ${err}`)
});

app.listen(PORT,()=>{
    console.log("Server started at port "+PORT)
})
