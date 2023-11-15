const { ObjectId } = require("mongodb")
const { getDb } = require("../utils/dbConnects")




const getSingleStudent = async(req,res) =>{
    try{
        const db = getDb()
        const id = req.params.id
        
        if(!id){
            return res.status(404).json({
                message: 'Id required!' 
            })
        }

        const query = { _id :new ObjectId(id) }
        
        const student = await db.collection('student').findOne(query)

        if(!student){
            return res.status(404).json({
                student,
                message: 'Invalid student id' 
            })
        }

        res.status(200).json({
            student,
            message: 'student found successfully'
        })

    }catch(err){
        console.log(err)
    }
}

const getAllStudent = async (req,res) =>{
    try{
        const db = getDb()
        const students = await db.collection('student').find().toArray()


        if(!students.length){
            return res.status(400).json({
                user,
                message: 'No students found!'
            })
        }

        res.status(200).json({
            students,
            message: 'students found successfully!'
        })

    }
    catch(err){
        console.log(err)
    }
}


const EditStudentData = async (req,res) =>{
    try{
        const db = getDb()
        const { father_name  , mother_name , date_of_brth , village , district , stnd_class , img_link , name } = req.body
        const id = req.params.id
        
    
        const query = { _id :new ObjectId(id) }

        if(!id){
            return res.status(404).json({
                message : 'No id found',
            })
        }
        // console.log(id)

        const student = await db.collection('student').findOne(query)
        if(!student){
            return res.status(404).json({
                message : 'No student found',
            })
        }

        const options = { 
            upsert: true 
        }

        const updateDoc = {
            $set: {
                name : name ? name : student.name,
                father_name : father_name ? father_name : student.father_name,
                mother_name : mother_name ? mother_name : student.mother_name,
                date_of_brth: date_of_brth ? date_of_brth : student.date_of_brth,
                village     : village ? village : student.village,
                district    : district ? district : student.district,
                stnd_class  : stnd_class ? stnd_class : student.stnd_class,
                img_link    : img_link ? img_link : student.img_link
            }
        }




        const result = await db.collection('student').updateOne(query, updateDoc, options);
        // console.log(result)

        res.status(200).json(result)

    }
    catch(err){
        console.log(err)
    }
}


const insertStudentData = async (req,res) =>{
    try{
        const db = getDb()
        const student_data = req.body
    
        if(!student_data){
            return res.status(404).json({
                message : 'Recieved no data',
            })
        }

        const response = await db.collection('student').insertMany(student_data)

        res.status(200).json(response)
    }
    catch(err){
        console.log(err)
    }
}


const deleteStudent = async (req,res) =>{
    try{
        const db = getDb()
        const id = req.params.id

        const query = { _id :new ObjectId(id) }

        const student = await db.collection('student').findOne(query)
        if(!student){
            return res.status(404).json({
                message : 'No student found',
            })
        }

        const delete_response = await db.collection('student').deleteOne(query)

        res.status(200).json(delete_response)
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {
    getSingleStudent,
    getAllStudent,
    EditStudentData,
    insertStudentData,
    deleteStudent
}