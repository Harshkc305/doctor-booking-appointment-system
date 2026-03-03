const rateLimit=require("express-rate-limit");

const limiter=rateLimit({
    windowMs:1 * 60 *10000, // 1 minute
    limit:40, // limit each IP to 40 requests per windowMs
    message:"Too many requests from this IP, please try again after 10 minutes"
})
module.exports=limiter;