const jwt = require('jsonwebtoken')

const verifyJWT = (req,res,next) =>{
    const authHeader = req.header('authorization')

    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        console.log(err)
        if(!err){
            const {email , role } = decoded.data
            req.email = email
            req.role = role
            next()
        }
    })
}

module.exports =  verifyJWT 