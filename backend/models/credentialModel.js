const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

//Schema that defines the structure of a record to be submitted to credentials document in the database 
const credentialSchema = new Schema({
    email: {type: String,
        require: true,
        unique: true
    },
    password: {type: String, 
        require: true
    },
},
{ timestamps: true }
);

//export the schema to be used for the controller and its functions 
module.exports = mongoose.model("credentials", credentialSchema);