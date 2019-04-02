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
    eventbrite = require('eventbrite').default,
    keystone = global.keystone,
    mongoose = global.keystone.get('mongoose'),
    Bluebird = require('bluebird');

mongoose.Promise = require('bluebird');

// Create configured Eventbrite SDK
const sdk = eventbrite({
    token: process.env.EVENTBRITE_TOKEN
});

/*
 * Get data
 */
exports.get = function (req, res) {
    let eventFields = 'name description date address latlng -_id';
    let event = keystone.list('Event').model;

    // Get events
    let eventsData = event.find({}, eventFields);

    Bluebird.props({
            events: eventsData
        })
        .then(results => {

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

                res.status(200).json({
                    events: results.events,
                    eventbrite: filtered
                });

            }).catch((err) => {
                console.error(err);
            });

        }).catch(err => {
            console.error(err);
        });

}