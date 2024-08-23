const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema that defines the structure of a record to be submitted to credentials document in the database
//Made email a unique index to stop duplicates as intended.
const credentialSchema = new Schema(
  {
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: false },
    role: { type: String, required: false },
  },
  { timestamps: true }
);

//export the schema to be used for the controller and its functions
module.exports = mongoose.model("credentials", credentialSchema);
