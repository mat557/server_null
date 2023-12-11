const { ObjectId } = require("mongodb")
const { getDb } = require("../utils/dbConnects")
const { format, addDays } = require('date-fns')



const getSingleNotice = async(req,res) =>{
    try{
        const db = getDb()
        const id = req.params

        if(!id){
            return res.status(404).json({
                message: "Id required"
            })
        }
        const query = {_id : new ObjectId(id)}
        const notice = await db.collection('notice').findOne(query)
        if(!notice){
            return res.status(404).json({
                message: 'No notice found!'
            })
        }

        res.status(200).json({
            notice,
            message:"Showing result"
        })
    }catch(err){
        console.log(err)
    }
}


const getAllNotices = async(req,res) =>{
    try{
        const db = getDb()
        const notices = await db.collection('notice').find().sort({ date: -1 }).toArray()
        const count = await db.collection('notice').countDocuments()

        if(!notices.length){
            return res.status(400).json({
                notices,
                message: 'No notice found!'
            })
        }

        res.status(200).json({
            count,
            notices,
            message: 'successful!'
        })
    }catch(err){
        console.log(err)
    }
}

const insertNotice = async(req,res) =>{
    try{
        const db = getDb()
        const { title , noticeBody , image } = req.body
        
        const email_d = req.email 
        const role_d  = req.role
        if(!email_d && (role_d !== 'admin' || role_d !== 'editor')){
            return res.status(404).json({
                message : 'Unauthorized',
            })
        }

        if(!title || !noticeBody){
            return res.status(404).json({
                message : 'No empty field allowed',
            })
        }

        const today = new Date()
        const formattedDate = format(today, 'yyyy-MM-dd HH:mm:ss')

        const notice = {
            title : title,
            description: noticeBody,
            date : formattedDate,
            posted_by: email_d,
            edited_by: '',
            file_url: image,
            edited: 0,
        }

        const response = await db.collection('notice').insertOne(notice)
        res.status(200).json({
            message : 'inserted successfully' , 
            response
        })
    }catch(err){
        console.log(err)
    }
}

const editNotice = async(req,res) =>{
    try{
        const db = getDb()
        const id = req.params.id
        const {title , description , file} = req.body
        
        const email_d = req.email 
        const role_d  = req.role
        if(!email_d && (role_d !== 'admin' || role_d !== 'editor')){
            return res.status(404).json({
                message : 'Unauthorized',
            })
        }

        if(!id){
            return res.status(404).json({
                message : 'No id found',
            })
        }

        const query = {_id : new ObjectId(id)}
        const notice = await db.collection('notice').findOne(query)
        if(!notice){
            return res.status(404).json({
                message : 'No data found with this id',
            })
        } 

        const today = new Date()
        const formattedDate = format(today, 'yyyy-MM-dd HH:mm:ss')

        const options = { upsert: true }
        const updateDoc = {
            $set: {
                title : title ? title : notice.title,
                description : description ? description : notice.description,
                file_url : file ? file : notice.file_url,
                date: formattedDate,
                posted_by: notice.posted_by,
                edited_by : email_d,
                edited: notice.edited+1
            }
        }
        const update = await db.collection('notice').updateMany(query,updateDoc,options)
        res.status(200).json({
            update,
            message: 'Updated!'
        })
    }catch(err){
        console.log(err)
    }
}


const deleteNotice = async(req,res) =>{
    try{
        const db = getDb()
        const id = req.params.id
        
        const email_d = req.email 
        const role_d  = req.role
        if(!email_d && (role_d !== 'admin' || role_d !== 'editor')){
            return res.status(404).json({
                message : 'Unauthorized',
            })
        }

        if(!id){
            if(!email_d && (role_d !== 'admin' || role_d !== 'editor')){
                return res.status(404).json({
                    message : `Can't delete!`,
                })
            }
        }

        const query = {_id : new ObjectId(id)}
        const notice = await db.collection('notice').findOne(query)
        if(!notice){
            return res.status(404).json({
                message : 'No data found to delete',
            })
        } 

        const response = await db.collection('notice').deleteOne(query)
        res.status(200).json({
            response,
            message: 'Deleted successfully'
        })

    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getSingleNotice,
    getAllNotices,
    insertNotice,
    editNotice,
    deleteNotice
}