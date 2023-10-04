var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    firstName : {
        required : true,
        type     : String
    },
    lastName : {
        required : true,
        type    : String
    },
    userName : {
        required : false,
        type    : String
    },
    mobilenumber : {
        required : true,
        type    : Number,
        length :10
    },
    otp:{
        required : true,
        type : Number
    },
    created_at : {
        type : Date,
        default : Date.now
    }
});
Schema.path('mobilenumber').validate(async (mobilenumber) =>{
    const mobilenumberCount = await mongoose.models.list.countDocuments({ mobilenumber })
    return !mobilenumberCount
  },'mobilenumber already exists');
    

