class ejsController{
    async HomePage(req,res){
        try{
            res.render("home")
            
        }catch(error){
            console.error("Error rendering home page:", error)
           
        }
    }

}
module.exports=new ejsController()