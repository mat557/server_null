const { ObjectId } = require("mongodb")
const { getDb } = require("../utils/dbConnects")


const getAllTeacher = async (req,res) =>{
    try{
        const db = getDb()
        const teachers = await db.collection('teacher').find().toArray()
        const count = await db.collection('teacher').countDocuments()

        if(!teachers.length){
            return res.status(400).json({
                teachers,
                message: 'No students found!'
            })
        }

        res.status(200).json({
            count,
            teachers,
            message: 'successfull!'
        })
    }catch(err){
        console.log(err)
    }
}


const EditTeacherData = async (req,res) =>{
    try{
        const db = getDb()
        const { name , number , img_link } = req.body
        const id = req.params.id

        const email_d = req.email 
        const role_d  = req.role

        if(!email_d && (role_d !== 'admin' || role_d !== 'editor')){
            return res.status(404).json({
                message : 'Unauthorized',
            })
        }

        const query = { _id :new ObjectId(id) }

        const teacher = await db.collection('teacher').findOne(query)

        if(!teacher){
            return res.status(404).json({
                message : 'No teacher found with this id',
            })
        }

        const options = { upsert: true }
        const updateDoc = {
            $set: {
                number : number ? number : teacher.number,
                name : name ? name : teacher.name,
                img_link : img_link ? img_link : teacher.img_link,
            }
        }

        const result = await db.collection('teacher').updateMany(query, updateDoc, options)

        res.status(200).json(result)
    }catch(err){
        console.log(err)
    }
}


const insertTeachersData = async (req,res) =>{
    try{
        const db = getDb()
        const teachers_data = req.body

        if(!teachers_data){
            return res.status(404).json({
                message : 'No student found',
            })
        }

        const email_d = req.email 
        const role_d  = req.role

        if(!email_d && (role_d !== 'admin' || role_d !== 'editor')){
            return res.status(404).json({
                message : 'Unauthorized',
            })
        }

        const dataArray = Array.isArray(teachers_data) ? teachers_data : [teachers_data]
        const response = await db.collection('teacher').insertMany(dataArray)

        res.status(200).json(response)
    }catch(err){
        console.log(err)
    }
}


const deleteTeacher = async (req,res) =>{
    try{
        const db = getDb()
        const id = req.params.id

        if(!id){
            return res.status(404).json({
                message : 'No id found',
            })
        }

        const email_d = req.email 
        const role_d  = req.role

        if(!email_d && (role_d !== 'admin' || role_d !== 'editor')){
            return res.status(404).json({
                message : 'Unauthorized',
            })
        }

        const query = { _id :new ObjectId(id) }
        const delete_response = await db.collection('teacher').deleteOne(query)
        res.status(200).json(delete_response)
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getAllTeacher,
    EditTeacherData,
    insertTeachersData,
    deleteTeacher
}