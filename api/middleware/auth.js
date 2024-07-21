const jwt=require('jsonwebtoken')
module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        console.log(token)
        const verify=jwt.verify(token,'this iss the dummy text');
        console.log('verifyed')
    
            next()  
        // for more bindation in appilication accessing
        // if(verify.usertype==admin)
        // {

        // }
        // else{
        //     return res.status(401).json({
        //         error:"not admin"
        //     })
     
        // }
    }
    catch(err){
        return res.status(500).json({
            message:'please send token'
        })
    }
}
