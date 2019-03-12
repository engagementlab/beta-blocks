'use strict';
/**
 * Developed by Engagement Lab, 2019
 * ==============
 * Route to retrieve events
 * @class api
 * @author Johnny Richardson
 *
 * ==========
 */

const eventbrite = require('eventbrite').default;
// Create configured Eventbrite SDK
const sdk = eventbrite({token: process.env.EVENTBRITE_TOKEN});
 

/*
 * Get data
 */
exports.get = function (req, res) {
    // https://www.eventbriteapi.com/v3/organizers/11331505152/events/?token=NWTWHFDRUG7FOHJBKXSQ
    sdk.request('/events/search/?token='+'11331505152').then(data => {
        res.status(200).json(data);
    });
}