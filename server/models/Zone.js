'use strict';
/**
 * Beta Blocks API server
 * 
 * Zone page Model
 * @module Zone
 * @class Zone
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = global.keystone;
var Types = keystone.Field.Types;

/**
 * Zone model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Zone = new keystone.List('Zone', 
	{
		label: 'Exploration Zones',
		singular: 'Exploration Zones',
		nodelete: true,
		nocreate: true
	});

/**
 * Model Fields
 * @main Zone
 */
Zone.add(
    {
        name: { type: String, default: "Exploration Zones Page", hidden: true, required: true, initial: true },
        intro: { type: Types.Textarea, label: 'Intro Text', required: true, initial: true },
        exampleImage: { type: Types.CloudinaryImage, folder: 'beta-blocks/cms', autoCleanup:true, required: true, initial: true }
    },
    'Location 1', {
        location1Name: { type: String, label: 'Name',required: true, initial: true },
        location1LatLng: { type: String, label: 'Lat/Lng', note: 'Seperate by comma', required: true, initial: true },
        location1Description: { type: String, label: 'Description',required: true, initial: true }
    },
    'Location 2', {
        location2Name: { type: String, label: 'Name',required: true, initial: true },
        location2LatLng: { type: String, label: 'Lat/Lng', note: 'Seperate by comma', required: true, initial: true },
        location2Description: { type: String, label: 'Description',required: true, initial: true }
    },
    'Location 3', {
        location3Name: { type: String, label: 'Name',required: true, initial: true },
        location3LatLng: { type: String, label: 'Lat/Lng', note: 'Seperate by comma', required: true, initial: true },
        location3Description: { type: String, label: 'Description',required: true, initial: true }
    }
);

/**
 * Model Registration
 */
Zone.defaultSort = '-createdAt';
Zone.defaultColumns = 'name';
Zone.register();
