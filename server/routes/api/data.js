'use strict';
/**
 * Developed by Engagement Lab, 2019
 * ==============
 * Route to retrieve data by url
 * @class api
 * @author Johnny Richardson
 *
 * ==========
 */

const redis = require('../../redis-client');
const yj = require('yieldable-json'),
_ = require('underscore');

var buildData = (options, res) => {

    redis.getAsync('mapData').then((data) => {

        yj.parseAsync(data, (err, parsed) => {
            res.status(200).json({
                status: 200,
                data: parsed
            });
        });

    });

}

/*
 * Get data
 */
exports.get = function (req, res) {

    let options = {};
    if (req.params.model)
        options.model = req.params.model;

    return buildData(options, res);

}
exports.set = function (req, res) {

    const request = require('request');

    request(
        'https://res.cloudinary.com/engagement-lab-home/raw/upload/v1551983475/beta-blocks/data2.geojson'
        , (err, response, body) => {
            // console.log(_.pluck(body.features, 'sidewalks'));
            
            yj.parseAsync(body, (err, parsed) => {
                _.each(parsed.features, (feat) => {
                    feat.properties = _.pick(feat.properties, 'sidewalks');
                    feat.properties.score = feat.properties.sidewalks.score;
                    delete feat.properties.sidewalks;
                });
                
                res.status(200).json({
                status: 200,
                data: parsed
            });
            redis.set('mapData', JSON.stringify(parsed));
        });
        });

}