var express = require('express');

const test = (req,res) => {
    var googleMapsClient = require('@google/maps').createClient({
        key: process.env.API_KEY
    });

    googleMapsClient.places({
        location: [28.607524599999998,77.09294729999999],
        radius: 5000,
        type: 'hospital'
    }, function(err, response) {
        if (!err) {
            console.log(response.json.results);
        }
        return res.status(200).send(response)
    });
}

module.exports = test;
