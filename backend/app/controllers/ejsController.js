class ejsController{
    async HomePage(req,res){
        try{
            res.render("home",{
                title:"Home",
                user:req.user
            })
            
        }catch(error){
            console.error("Error rendering home page:", error)
           
        }
    }

}
module.exports=new ejsController()