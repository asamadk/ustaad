const express = require('express');
const router = express.Router();
const StateModel = require('../Models/State');

router.get('/',async (req,res)=>{

    const state =  await StateModel.find({});
    res.json(state)
})

module.exports = router