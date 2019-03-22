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

const _ = require('underscore'),
    eventbrite = require('eventbrite').default;

// Create configured Eventbrite SDK
const sdk = eventbrite({
    token: process.env.EVENTBRITE_TOKEN
});


/*
 * Get data
 */
exports.get = function (req, res) {
    // https://www.eventbriteapi.com/v3/organizers/11331505152/events/?token=NWTWHFDRUG7FOHJBKXSQ
    sdk.request('/organizers/11331505152/events/?expand=venue').then(data => {
        let filtered = [];

        filtered = _.map(data.events, (e) => {
            return {
                id: e.id,
                name: e.name.html,
                url: e.url,
                lat: e.venue.address.latitude,
                lng: e.venue.address.longitude,
                description: e.description.text,
                date: new Date(e.start.local).toUTCString(),
                street: e.venue.address.address_1 + '\n' + e.venue.address.address_2
            }
        });

        res.status(200).json({data: filtered});
    }).catch((err) => {
        console.error(err);
    });
}