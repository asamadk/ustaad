const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const StateModel = require('../Models/State');
const DistrictModel = require('../Models/District');

const addLocationData = () => {
    fs.readFile(`${__dirname}/states-and-districts.json`,(err, data)=>{
        if(err) throw err;
        const result = JSON.parse(data);
        result.states.map(state => {
            const newState = new StateModel({
                _id : new mongoose.Types.ObjectId,
                name : state.state
            })
            state.districts.map(d => {
                const district = new DistrictModel({
                    _id : new mongoose.Types.ObjectId,
                    name : d,
                    stateId : newState._id 
                })
                district.save();
            })
            newState.save()
        })
    })
}

module.exports = addLocationData;