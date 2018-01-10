var express = require('express');
var router = express.Router();
var request = require('ajax-request');

router.get('/', function(req, ress, next) {
    request('https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyAys8Y4v7-APq0BEfydsAh28aH-_Q5Vf6o', function(err, res, body) {
        if(err) return res.status(400).send(err)
        return ress.status(200).send(body)
    });
});

module.exports = router;
