// const jwt=require("jsonwebtoken");

// const generateToken=(admin)=>{
//     return jwt.sign(
//         {id:admin._id,},
//         process.env.ACCESS_TOKEN,
//         {expiresIn:"1m"}
//     )
// }

// const generateRefreshToken=(admin)=>{
//     return jwt.sign(
//         {id:admin._id},
//         process.env.REFRESH_TOKEN,
//         {expiresIn:"7d"}

//     )
// }

// module.exports={
//     generateToken,
//     generateRefreshToken
// }