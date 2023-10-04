const otpGenerator = require ('otp-generator');
        const twilio = require("twilio");
// const { use } = require('../Routes/routes');

User = require('../Model/Models.js');

exports.Dao_index = function(req,callback)
{
    User.get(function (err,user){
        if (err)
            callback.json({
                status : "Error",
                message: err
            });
            callback.json({
                status : "Success",
                message: "Got user details Successfully",
                data   : user
            });
    });
};

exports.Dao_view = function (req,callback) 

{
    User.find({mobilenumber:req.params.mobilenumber}, function (err,user) 
    {
        if(err)
             callback.send(err)

             callback.json({
            message : "User Signup Details",
            data    : user
        }); 
    });    

    }

exports.Dao_update = function (req,callback) 
{
    User.find({mobilenumber:req.params.usermobilenumber}, function (err,user)
    {
        
        const MessagingResponse = require("twilio").twiml.MessagingResponse;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
    
        if (err)
        callback.send(err);
        user.mobilenumber= req.body.moobilenumber,
        user.otp  = otp;

        user.save(function (err) {
            if (err)
            callback.json(err)
            callback.json({
                message : "*** User details updated successfully ***",
                data    : user
            });
        });
    });
};

exports.Dao_Delete = function (req,callback)
{
    User.deleteOne({mobilenumber:req.params.usermobilenumber}, function (err,user)
    {
        if (err)
        callback.send(err)
        callback.json({
            status : "Success",
            message: "*** User Deleted Successfully ***",
            data   : user
        });
    });
};
