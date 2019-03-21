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

    const request = require('request'),
          dictionary = require('../../dictionary');
    let keys = _.keys(dictionary);

    request(
        'https://res.cloudinary.com/engagement-lab-home/raw/upload/beta-blocks/data.geojson'
        , (err, response, body) => {

            yj.parseAsync(body, (err, parsed) => {

                _.each(parsed.features, (feat) => {

                    let props = feat.properties;

                    _.each(feat.geometry.coordinates[0], (coord) => {

                        coord[0] = coord[0].toPrecision(6);
                        coord[1] = coord[1].toPrecision(6);

                    });
                    
                    props.sidewalk = Math.round(props.sidewalks_area_score/props.sidewalks_area);
                    props.pop = props.census_b01003001 * (props._area/props.census_area);
                    props.origin = [props.origin[0].toPrecision(6), props.origin[1].toPrecision(6)]
                    
                    // delete props.sidewalks_area_score;
                    // delete props.sidewalks_area;
                    // delete props.sidewalks_score;
                    // delete props.sidewalks_count;
                    delete props.census_area;
                    delete props._area;
                    
                    /* _.each(keys, (key) => {
                        let value = feat.properties['census_'+key];
                        if(value) {
                            feat.properties[dictionary[key]] = value;
                            delete feat.properties['census_'+key];
                        }
                    }); */

                });
                
                res.status(200).json({
                    status: 200,
                    data: parsed
                });
                redis.set('mapData', JSON.stringify(parsed));
            });

        });

}