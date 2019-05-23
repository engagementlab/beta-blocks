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
		label: 'Start Time',
		required: true,
		initial: true
	},
	endDate: {
		label: 'End Time',
		type: Types.Datetime,
		initial: true
	},
	startDate2: {
		type: Types.Datetime,
		label: 'Start Time 2',
		note: 'Use if event occurs over two days'
	},
	endDate2: {
		label: 'End Time 2',
		type: Types.Datetime,
		note: 'Use if event occurs over two days'
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
	},
	next: {
		type: Boolean,
		label: 'Event is coming up next.'
	}
});

/**
 * Model Registration
 */
Event.defaultSort = '-createdAt';
Event.defaultColumns = 'name, current, next';
Event.register();