'use strict';
/**
 * Developed by Engagement Lab, 2019
 * ==============
 * Route to retrieve people
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
    let person = keystone.list('Person').model;

    // Get people
    let peopleData = person.find({}, 'name title bio.html websiteURL -_id').sort({'name.first': 1});

    Bluebird.props({
            peopleData
        })
        .then(results => {

            res.status(200).json(results);

        }).catch((err) => {
            console.error(err);
        });
}