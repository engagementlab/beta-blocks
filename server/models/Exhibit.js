'use strict';
/**
 * Beta Blocks API server
 * 
 * Exhibit page Model
 * @module about
 * @class about
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = global.keystone;
var Types = keystone.Field.Types;

/**
 * about model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Exhibit = new keystone.List('Exhibit', 
	{
		label: 'Exhibit Info',
		singular: 'Exhibit Info',
		// nodelete: true,
		// nocreate: true
	});

/**
 * Model Fields
 * @main Exhibit
 */
Exhibit.add({
	
	name: { type: String, default: 'Exhibit Info', hidden: true, required: true, initial: true },
	seeInfo: { type: Types.Textarea, required: true, initial: true}
});

/**
 * Model Registration
 */
Exhibit.defaultSort = '-createdAt';
Exhibit.defaultColumns = 'name';
Exhibit.register();
