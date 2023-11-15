const allowedOrigin = require("./allowedOrigins")


const corsOption = {
    origin : function (origin , callback) {
        if(allowedOrigin.indexOf(origin) !== -1){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    allowedHeaders: ['authorization', 'Content-Type'],
    credentials : true,
    optionsSuccessStatus : 204
}

module.exports = corsOption