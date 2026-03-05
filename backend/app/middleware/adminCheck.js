function AdminCheck(req,res,next){
    if(req.user.role !== "admin"){
        console.log("Access denied. Admins only.")
        return res.redirect("/admin-login-page")
    }
    next();
}
module.exports=AdminCheck;