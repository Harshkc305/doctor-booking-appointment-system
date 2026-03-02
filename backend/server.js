require("dotenv").config();
const express = require("express")
const dbcon=require("./app/config/dbcon")
const path = require("path");
const app = express();


dbcon();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true}));

// for public folder
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")))

// static folder
app.use("/uploads",express.static(path.join(__dirname,"uploads")))


// Routes
const ejsRouter=require("./app/routes/ejsRouter");
app.use(ejsRouter)

const adminRouter=require("./app/routes/adminRouter");
app.use(adminRouter)



const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port @http://localhost:${PORT}`)
})
