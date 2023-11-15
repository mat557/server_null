const { ObjectId } = require("mongodb")
const { getDb } = require("../utils/dbConnects")




const getSingleTeacher = async(req,res) =>{
    try{
        const db = getDb()
        const id = req.params.id
        
        if(!id){
            return res.status(404).json({
                message: 'Id required!' 
            })
        }

        const query = { _id :new ObjectId(id) }
        
        const teacher = await db.collection('teacher').findOne(query)
        
        if(!teacher){
            return res.status(404).json({
                teacher,
                 message: 'Invalid student id' 
            })
        }

        res.status(200).json({
            teacher,
            message: 'successfull'
        })

    }catch(err){
        console.log(err)
    }
}


const getAllTeacher = async (req,res) =>{
    try{
        const db = getDb()
        
        const teachers = await db.collection('teacher').find().toArray()
        
        // console.log(teachers)
        if(!teachers.length){
            return res.status(400).json({
                teachers,
                message: 'No students found!'
            })
        }

        res.status(200).json({
            teachers,
            message: 'successfull!'
        })

    }
    catch(err){
        console.log(err)
    }
}


const EditTeacherData = async (req,res) =>{
    try{
        const db = getDb()
        const { name , number , img_link } = req.body
        const id = req.params.id
        
        console.log(id,req.body)

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
                // position : position ? position : teacher.position,
                name : name ? name : teacher.name,
                // per_address : per_address ? per_address : teacher.per_address,
                img_link : img_link ? img_link : teacher.img_link,
            }
        }


        const result = await db.collection('teacher').updateMany(query, updateDoc, options)

        res.status(200).json(result)

    }
    catch(err){
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

        const response = await db.collection('teacher').insertMany(teachers_data)

        res.status(200).json(response)
    }
    catch(err){
        console.log(err)
    }
}


const deleteTeacher = async (req,res) =>{
    try{
        const db = getDb()
        const id = req.params.id

        const query = { _id :new ObjectId(id) }

        const delete_response = await db.collection('teacher').deleteOne(query)

        res.status(200).json(delete_response)
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {
    getSingleTeacher,
    getAllTeacher,
    EditTeacherData,
    insertTeachersData,
    deleteTeacher
}