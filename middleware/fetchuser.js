const jwt=require("jsonwebtoken");
const fetchuser=(req,res,next)=>{
    //get the user from the jwt token and add id to req object
    try{
    const token = req.header('token');
    if(!token){
        res.status(401).send({error: "token not found"})
    }
        const data = jwt.verify(token, "notebookApp");
        req.user= data.user;
        next();

    }
    catch(error){
        res.status(401).json({error:error.message})
    }

}

module.exports = fetchuser;