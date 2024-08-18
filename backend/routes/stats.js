const express = require("express");
const { getStatRecord } = require("../controllers/statsController");
const router = express.Router();

//get the functions from the statController
//const { getStatRecord } = require("../controllers/statController");

/* router.get("/", (req, res) => {
  res.json({ mssg: "Get all stats" });
}); */

router.get("/:id", getStatRecord);

//This one would be used for the course details
//router.get("/:id", getStatRecord);

module.exports = router;
