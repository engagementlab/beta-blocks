'use strict';
/**
 * Developed by Engagement Lab, 2019
 * ==============
 * Route to retrieve exploration zone page
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
    let zone = keystone.list('Zone').model;

    // Get page data
    let zoneData = zone.findOne({});

    Bluebird.props({
            zoneData
        })
        .then(results => {

            res.status(200).json(results);

        }).catch((err) => {
            console.error(err);
        });
}