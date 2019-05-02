'use strict';
/**
 * Developed by Engagement Lab, 2019
 * ==============
 * Route to retrieve tech partners
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
    let tool = keystone.list('Tool').model;
    // Get tool
    let toolData = tool.findOne({});

    Bluebird.props({
            toolData
        })
        .then(results => {

            res.status(200).json(results);

        }).catch((err) => {
            console.error(err);
        });
}