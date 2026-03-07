require("dotenv").config();
const express = require("express")
const app = express();
const cors=require("cors")
const dbcon=require("./app/config/dbcon")
const cookieParser=require("cookie-parser")
const path = require("path");
// const helmet=require("helmet")

// const limiter=require("./app/utils/ratelimiter")

// connect to database
dbcon();

// cors
app.use(cors());

// limiter
// app.use(limiter);

// helmet
// app.use(helmet());

// cookie parser
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "views");


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

// doctor
const doctorRouter=require("./app/routes/doctorRouter");
app.use(doctorRouter)



const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port @http://localhost:${PORT}`)
})
