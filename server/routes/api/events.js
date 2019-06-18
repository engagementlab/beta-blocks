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
    
    if (req.params.eventbrite) {
        sdk.request('/events/search/?organizer.id=19752347294&sort_by=date&expand=venue').then(data => {
            let filtered = [];

            filtered = _.map(data.events, (e) => {
                let addr2 = e.venue.address.address_2;
                if(!addr2) 
                    addr2 = '';
                else
                    addr2 = '<br />' + addr2;

                return {
                    id: e.id,
                    name: e.name.html,
                    url: e.url,
                    lat: e.venue.address.latitude,
                    lng: e.venue.address.longitude,
                    description: e.description.text,
                    date: new Date(e.start.local),
                    street: e.venue.address.address_1 + addr2
                }
    
            });
            res.status(200).json({
                eventbrite: filtered
            });
        }).catch((err) => {
            console.error(err);
        });

        return;
    }

    let eventFields = 'name description startDate endDate startDate2 endDate2 address current latlng -_id';
    let event = keystone.list('Event').model;

    // Get events
    let eventsData = event.find({}, eventFields).sort({'startDate': 1});

    Bluebird.props({
            events: eventsData
        })
        .then(results => {           

            res.status(200).json({
                events: results.events
            });

        }).catch(err => {
            console.error(err);
        });

}