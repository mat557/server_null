const jwt = require('jsonwebtoken')
const { getDb } = require("../utils/dbConnects")
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')


const getAlleUser = async(req,res) =>{
    try{
        const db = getDb()

        const options = {
            projection: { password: 0}
        }
        
        const email_d = req.email 
        const role_d  = req.role

        if(!email_d && !role_d){
            return res.status(404).json({
                message : 'Unauthorized',
            })
        }

        const editorial = await db.collection('editorial').find({},options).toArray()

        if(!editorial.length){
            return res.status(400).json({
                editorial,
                message: 'No user found!'
            })
        }

        res.status(200).json({
            editorial,
            message: 'Successful!'
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}



const updateEditorials = async(req,res) =>{
    try{
        const db = getDb()
        const id = req.params
        const { email , name , number , role , status , password } = req.body

        const email_d = req.email 
        const role_d  = req.role

        if(!email_d && (role_d === 'admin' || role_d === 'editor')){
            return res.status(404).json({
                message : 'Unauthorized',
            })
        }

        let hashedPass
        if(password.length){
            const saltRounds = 10;
            hashedPass = await bcrypt.hash( password , saltRounds )
        }

        const query = { _id : new ObjectId(id) }

        const user = await db.collection('editorial').findOne(query)
        if(!user){
            return res.status(403).json({
                message : 'No user found',
            })
        }

        const options = { upsert: true };

        let setStatus

        if(status !== user.status){
            setStatus = status
        }else{
            setStatus = user.status
        }

        const updateDoc = {
            $set: {
                email : email ? email : user.email,
                password: password ? hashedPass : user.password,
                number : number ? number : user.number,
                role : role ? role : user.role,
                name : name ? name : user.name,
            },
        };

        const result = await db.collection('editorial').updateOne(query, updateDoc, options);


        res.status(200).json(result)

    }catch(err){
        console.log(err)
    }
}


const createUserController = async (req,res) =>{
    try{
        const db = getDb()
        const { email , name , password , number , role } = req.body


        if(!email || !name || !password || !number || !role){
            return res.status(404).json({ 
                message : `No empty field allowed!`
            })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return res.status(400).json({
              message: 'Invalid email format!',
            });
        }

        const email_d = req.email 
        const role_d  = req.role

        if(!email_d && role_d === 'admin'){
            return res.status(404).json({
                message : 'Unauthorized',
            })
        }


        const query = { email : email }
        const options = {
            projection: { email : 1 }
        }

        const match = await db.collection('editorial').findOne(query,options)
        if(match){
            return res.status(404).json({ 
                message : `User with email ${match.email} exist already. Please login`
            })
        }

        const saltRounds = 10;
        const hashedPass = await bcrypt.hash( password , saltRounds )

        const user_doc = {
            email : email,
            name : name,
            password: hashedPass,
            number : number,
            role : role,
        }

        const response = await db.collection('editorial').insertOne(user_doc)

        res.status(200).json({ 
            response
        })
    }catch(err){
        console.log(err)
    }
}


const signUpForAdmin = async (req,res) =>{
    try{
        const db = getDb()
        const { email , name , password , number , role } = req.body


        if(!email || !name || !password || !number || !role){
            return res.status(404).json({ 
                message : `No empty field allowed!`
            })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return res.status(400).json({
              message: 'Invalid email format!',
            });
        }

        const query1 = { role : role }

        const isAdmin = await db.collection('editorial').findOne(query1)

        if(isAdmin && isAdmin.role === 'admin'){
            return res.status(404).json({ 
                message : `The website has already an admin`
            })
        }

        const query = { email : email }
        const options = {
            projection: { email : 1 }
        }

        const match = await db.collection('editorial').findOne(query,options)
        if(match){
            return res.status(404).json({ 
                message : `User with email ${match.email} exist already. Please login`
            })
        }

        const saltRounds = 10;
        const hashedPass = await bcrypt.hash( password , saltRounds )

        
        const user_doc = {
            email : email,
            name : name,
            password: hashedPass,
            number : number,
            role : role,
        }

        const jwt_user_data = {
            email:email,
            role: role
        }

        const access_token = jwt.sign({
            data: jwt_user_data
          }, process.env.ACCESS_TOKEN_SECRET, 
          { expiresIn: '7d' }
        )


        const response = await db.collection('editorial').insertOne(user_doc)


        res.status(200).json({ 
            response,
            access_token
        })
    }catch(err){
        console.log(err)
    }
}


const loginEditorialController = async (req,res) =>{
    try{
        const db = getDb()
        const { email , password } = req.body

        if(!email || !password){
            return res.status(404).json({ 
                message : `No empty field allowed!`
            })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).json({
              message: 'Invalid email format!',
            });
        }

        const query = { email : email }
        const user = await db.collection('editorial').findOne(query)
        
        if(!user){
            return res.status(403).json({
                message: 'Invaid email or password!',
                suggest : 'Please try again or create account.'
            })
        }

        if (!user.password) {
            return res.status(403).json({
                message: 'Invalid email or password!',
                suggest: 'Please try again or create an account.'
            });
        }

        const matched = await bcrypt.compare(password, user?.password)
        
        if(!matched){
            return res.status(403).json({ 
                message : 'Invalid email or password!',
            })
        }

        const jwt_user_data = {
            email:email,
            role: user.role
        }

        const access_token = jwt.sign({
            data: jwt_user_data
          }, process.env.ACCESS_TOKEN_SECRET, 
          { expiresIn: '7d' }
        )

        res.status(200).json({
            message: 'User found!',
            additional : 'Login successfull',
            access_token
        })
    }
    catch(err){
        console.log(err)
    }
}


const logoutUserController = async (req,res) =>{
    try{
        res.clearCookie('token', { 
            httpOnly: true, 
            sameSite: 'None', 
            secure: true 
        })

        res.json({ 
            message: 'Process successfull' 
        })

    }catch(err){
        console.log(err)
    }
}



const deleteEditoriaMember = async (req,res) =>{
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

        if(!email_d && role_d === 'admin'){
            return res.status(404).json({
                message : 'Unauthorized',
            })
        }

        const query = { _id :new ObjectId(id) }

        const delete_response = await db.collection('editorial').deleteOne(query)

        res.status(200).json(delete_response)
    }catch(err){
        console.log(err)
    }
}


const adminChecker = async(req,res) =>{
    try{
        const db = getDb()
        let present = false
        let admin_e = ''
        const query = { role : 'admin'}

        const isAdmin = await db.collection('editorial').findOne(query)
        admin_e = isAdmin.email
  
        if(isAdmin){
            present = true
        }

        res.status(200).json({present,admin_e})
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getAlleUser,
    createUserController,
    signUpForAdmin,
    loginEditorialController,
    logoutUserController,
    updateEditorials,
    deleteEditoriaMember,
    adminChecker
}