const USER=require("../models/applications");

async function existingUser(req,res,next){
    const {email,phone}=req.body;
    const findEmail=await USER.findOne({email:email});
    const findPhone=await USER.findOne({phone:phone});
    if(findEmail || findPhone){
        req.session.alert="User alrealy exists";
        return res.redirect("/application"); // Redirect to the application form page
    }
    next(); 
}

module.exports=existingUser;