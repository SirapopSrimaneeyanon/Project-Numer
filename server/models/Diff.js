let mongoose = require('mongoose');

//Schema Validation

let userSchema5 = mongoose.Schema({
    
    fx : {type: String ,required : true },
    degree : {type: Number ,required : true},
    x : {type: Number ,required : true},
    h : {type: Number ,required : true}
});

let Diff = mongoose.model('Diff',userSchema5);
module.exports = Diff;