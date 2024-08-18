const Stats = require("../models/statsModel");

//function to get a single review based on coursecode
const getStatRecord = async (req, res) => {
  const { id } = req.params;

  console.log("coursecode received: " + id);

  // Find the stat record based on the coursecode
  const stat = await Stats.findOne({ coursecode: id });

  // If stat record not found, exit the code with the error
  if (!stat) {
    return res.status(404).json({ error: "This stat does not exist" });
  }

  res.status(200).json(stat);
};

//this is where you export the functions to be used in another file
module.exports = {
  getStatRecord,
};
