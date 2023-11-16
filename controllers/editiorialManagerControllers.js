const { ObjectId } = require("mongodb")
const { getDb } = require("../utils/dbConnects")



const getAllEditorials = async (req,res) =>{
    try{
        const db = getDb()
        
        const editorials = await db.collection('editorials').find().toArray()
        
        // console.log(teachers)
        if(!editorials.length){
            return res.status(400).json({
                editorials,
                message: 'No editorials member found!'
            })
        }

        res.status(200).json({
            editorials,
            message: 'successfull!'
        })
    }
    catch(err){
        console.log(err)
    }
}



const createNewEditorials = async (req,res) =>{
    try{
        const db = getDb()
        const member_data = req.body

        // console.log(member_data)

        if(!member_data){
            return res.status(404).json({
                message : 'No data found',
            })
        }

        const response = await db.collection('editorials').insertOne(member_data)
        console.log(response)
        res.status(200).json(response)
    }
    catch(err){
        console.log(err)
    }
}


const editCommitteMember = async (req,res) =>{
    try{
        const db = getDb()
        const { name , email , number , occupation , password } = req.body
        const id = req.params.id


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
                number : number ? number : member.number,
                email : email ? email : member.email,
                name : name ? name : member.name,
                occupation : occupation ? occupation : member.occupation,
            }
        }

        const result = await db.collection('committe').updateMany(query, updateDoc, options)

        res.status(200).json(result)
    }
    catch(err){
        console.log(err)
    }
}


const deleteCommitteMember = async (req,res) =>{
    try{
        const db = getDb()
        const id = req.params.id
        console.log(id)
        if(!id){
            return res.status(404).json({
                message : 'No id found',
            })
        }

        const query = { _id :new ObjectId(id) }

        const delete_response = await db.collection('committe').deleteOne(query)

        res.status(200).json(delete_response)
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {
    getAllEditorials,
    createNewEditorials,
    editCommitteMember,
    deleteCommitteMember
}