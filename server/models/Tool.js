'use strict';
/**
 * Beta Blocks API server
 * 
 * Tool page Model
 * @module tool
 * @class tool
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
var Tool = new keystone.List('Tool', 
	{
		label: 'Tool Settings',
		singular: 'tool',
		// nodelete: true,
		// nocreate: true
	});

/**
 * Model Fields
 * @main Tool
 */
Tool.add({
	
	name: { type: String, default: 'Tool Settings', hidden: true, required: true, initial: true },
    url: { type: Types.Url, required: true, initial: true }
    
});
/**
 * Model Registration
 */
Tool.defaultSort = '-createdAt';
Tool.defaultColumns = 'name';
Tool.register();
