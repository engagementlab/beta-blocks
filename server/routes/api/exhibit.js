'use strict';
/**
 * Developed by Engagement Lab, 2019
 * ==============
 * Route to retrieve exhibit partners
 * @class api
 * @author Johnny Richardson
 *
 * ==========
 */

const _ = require('underscore'),
    keystone = global.keystone,
    mongoose = global.keystone.get('mongoose'),
    Bluebird = require('bluebird');

mongoose.Promise = require('bluebird');

/*
 * Get data
 */
exports.get = function (req, res) {
    let exhibit = keystone.list('Exhibit').model;
    let event = keystone.list('Event').model;
    
    // Get exhibit info and events (exhibit locations)
    let eventFields = 'name description startDate endDate address current latlng -_id';
    
    let exhibitData = exhibit.findOne({}, 'see explore reflect gather tinker -_id');
    let eventsData = event.find({}, eventFields);

    Bluebird.props({
            exhibitData,
            eventsData
        })
        .then(results => {

            res.status(200).json(results);

        }).catch((err) => {
            console.error(err);
        });
}