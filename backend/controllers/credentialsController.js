const Credentials = require("../models/credentialModel");
const mongoose = require("mongoose");

const createUser = async(req, res) => {
    const {
        email,
        password,
    } = req.body;

    try{
        const register = await Credentials.create({
            email,
            password,
        });

        res.status(200).json(register);
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

module.exports ={
    createUser,
}