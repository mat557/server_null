const { ObjectId } = require("mongodb")
const { getDb } = require("../utils/dbConnects")


const getAllCommitteMember = async (req,res) =>{
    try{
        const db = getDb()
        
        const committe = await db.collection('committe').find().toArray()
        
        // console.log(teachers)
        if(!committe.length){
            return res.status(400).json({
                committe,
                message: 'No committe member found!'
            })
        }

        res.status(200).json({
            committe,
            message: 'successfull!'
        })
    }catch(err){
        console.log(err)
    }
}



const createNewCommitteMember = async (req,res) =>{
    try{
        const db = getDb()
        const member_data = req.body

        const email_d = req.email 
        const role_d  = req.role
        
        if(!email_d && (role_d !== 'admin' || role_d !== 'editor')){
            return res.status(404).json({
                message : 'Unauthorized',
            })
        }

        if(!member_data){
            return res.status(404).json({
                message : 'No student found',
            })
        }

        const response = await db.collection('committe').insertOne(member_data)
  
        res.status(200).json(response)
    }catch(err){
        console.log(err)
    }
}


const editCommitteMember = async (req,res) =>{
    try{
        const db = getDb()
        const { name,email,number, occupation } = req.body
        const id = req.params.id

        const email_d = req.email 
        const role_d  = req.role
        
        if(!email_d && (role_d !== 'admin' || role_d !== 'editor')){
            return res.status(404).json({
                message : 'Unauthorized',
            })
        }

        const query = { _id :new ObjectId(id) }
        const member = await db.collection('committe').findOne(query)
        if(!member){
            return res.status(404).json({
                message : 'No member found with this id',
            })
        }

        const options = { upsert: true }
        const updateDoc = {
            $set: {
                name : name ? name : member.name,
                number : number ? number : member.number,
                email : email ? email : member.email,
                name : name ? name : member.name,
                occupation : occupation ? occupation : member.occupation,
            }
        }

        const result = await db.collection('committe').updateMany(query, updateDoc, options)

        res.status(200).json(result)
    }catch(err){
        console.log(err)
    }
}


const deleteCommitteMember = async (req,res) =>{
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
            return res.status(404).json({
                message : 'No id found',
            })
        }

        const query = { _id :new ObjectId(id) }
        const delete_response = await db.collection('committe').deleteOne(query)
        res.status(200).json(delete_response)
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getAllCommitteMember,
    createNewCommitteMember,
    editCommitteMember,
    deleteCommitteMember
}