'use strict';
/**
 * Beta Blocks API server
 * 
 * Event page Model
 * @module event
 * @class event
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = global.keystone;
var Types = keystone.Field.Types;
const mongoose = require('mongoose');

/**
 * event model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Event = new keystone.List('Event', {
	label: 'Events',
	singular: 'Event'
});

/**
 * Model Fields
 * @main Event
 */
Event.add({

	name: {
		type: String,
		default: 'Event Name',
		hidden: true,
		required: true,
		initial: true
	},
	type: {
		type: Types.Select,
		options: ['Exhibit', 'Workshop'],
		required: true,
		initial: true
	},
	startDate: {
		type: Types.Datetime,
		required: true,
		initial: true
	},
	endDate: {
		type: Types.Datetime
	},
	address: {
		type: String,
		required: true,
		initial: true,
		note: 'Please use format: 120 Boylston St. Boston, MA 02116'
	},
	description: {
		type: Types.Textarea,
		required: true,
		initial: true
	},
	current: {
		type: Boolean,
		label: 'Event is happening now.'
	}
});

Event.schema.add({
	latlng: mongoose.Schema.Types.Mixed
});

Event.schema.pre('save', function (next) {
	
	const request = require('request'),
		  url = 'https://api.opencagedata.com/geocode/v1/json?key=' + process.env.OPENCAGE_KEY + '&limit=1&no_annotations=1&q=' + this.address;

	request(url, (err, response, body) => {
		// Save latlng of address
		let latlng = JSON.parse(body).results[0].geometry;
		this.latlng = {
			lat: latlng.lat,
			lng: latlng.lng
		}
		next();
	});


});
/**
 * Model Registration
 */
Event.defaultSort = '-createdAt';
Event.defaultColumns = 'name';
Event.register();