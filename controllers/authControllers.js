const jwt = require('jsonwebtoken')
const { getDb } = require("../utils/dbConnects")
const bcrypt = require('bcrypt')



const createUserController = async (req,res) =>{
    try{
        const db = getDb()
        const { email , name , password , number } = req.body

        console.log(req.body)

        if(!email || !name || !password || !number){
            return res.status(404).json({ 
                message : `No empty field allowed!`
            })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return res.status(400).json({
              message: 'Invalid email format!',
            });
        }


        const query = { email : email }
        const options = {
            projection: { email : 1 }
        }

        const match = await db.collection('user').findOne(query,options)
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
            role : '',
        }



        const jwt_user_data = {
            email:email,
            role: ''
        }

        const access_token = jwt.sign({
            data: jwt_user_data
          }, process.env.ACCESS_TOKEN_SECRET, 
          { expiresIn: '1h' }
        )

        const refresh_token = jwt.sign({
            data: jwt_user_data
          }, 
          process.env.ACCESS_TOKEN_SECRET, 
          { expiresIn: '1h' }
        )

        const response = await db.collection('user').insertOne(user_doc)

        res.cookie('refresh_token', refresh_token,{
            httpOnly: true, 
            secure: true, 
            sameSite: 'None',  
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({ 
            response ,
            access_token,
            refresh_token
        })


    }
    catch(err){
        console.log(err)
    }
}


const loginUserController = async (req,res) =>{
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
        const user = await db.collection('users').findOne(query)
        

        if(email !== user.email){
            return res.status(403).json({
                message: 'Invaid email or password!',
                suggest : 'Please try again or create account.'
            })
        }

        const matched = await bcrypt.compare(password, user.password)

        if(!matched){
            return res.status(403).json({ 
                message : 'Invalid email or password!',
                suggest : 'Please try again or create account.'
            })
        }

        const jwt_user_data = {
            email:email,
            role: user.role
        }

        const refresh_token = jwt.sign({
            data: jwt_user_data
          }, process.env.ACCESS_TOKEN_SECRET, 
          { expiresIn: '1h' }
        );

        const access_token = jwt.sign({
            data: jwt_user_data
          }, process.env.ACCESS_TOKEN_SECRET, 
          { expiresIn: '1h' }
        );


        res.cookie('token',
            access_token,
        { 
            maxAge: 900000, 
            httpOnly: true ,
            sameSite: 'None', 
            secure: true,
        })
        
        res.status(200).json({
            message: 'User found!',
            additional : 'Login successfull',
            access_token,
            refresh_token
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

    }
    catch(err){
        console.log(err)
    }
}



const getSingleUserByToken = async(req,res) =>{
    try{
        const db = getDb()
        const token = req.params.token

        if(!token){
            return res.status(403).json({
                message : 'Please login or create an account!'
            })
        }

        // console.log(token)

        var decoded;

        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            console.error(err);
            return res.status(401).json({
                message: 'Invalid token'

            });
        }

        // console.log(decoded)

        const query = { email: decoded.data.email}
        const options = {
            projection: { password: 0 }
        }

        const user = await db.collection('users').findOne(query,options)
        
        const jwt_user_data = {
            email: user.email,
            role: user.role ||  ''
        }

        const access_token = jwt.sign({
            data: jwt_user_data
          }, process.env.ACCESS_TOKEN_SECRET, 
          { expiresIn: '1h' }
        );

        res.status(200).json({
            user,
            access_token
        })

    }catch(err){
        console.log(err)
    }
}


module.exports = {
    createUserController,
    loginUserController,
    logoutUserController,
    getSingleUserByToken
}