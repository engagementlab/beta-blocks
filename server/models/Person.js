'use strict';
/**
 * 
 * Beta Blocks API server
 * 
 * Person Model
 * @module people
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

const keystone = global.keystone;
const Types = keystone.Field.Types;

/**
 * @module team
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Person = new keystone.List('Person', {
	label: 'People',
	singular: 'Person',
	plural: 'People',
	sortable: true,
	autokey: {
		path: 'key',
		from: 'name',
		unique: true
	}
});

/**
 * Model Fields
 * @main Person
 */
Person.add({

	name: {
		type: Types.Name,
		required: true,
		initial: true,
		index: true
	},
	title: {
		type: String,
		initial: true,
        required: true
	},
	bio: {
		type: Types.Markdown,
		required: true,
		initial: true
	},
	websiteURL: {
		type: Types.Url,
		label: 'Website URL',
	}

});

/**
 * Model Registration
 */
Person.defaultColumns = 'name, title';
Person.register();