'use strict';
/**
 * Beta Blocks API server
 * 
 * Tech page Model
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
var Tech = new keystone.List('Tech', 
	{
		label: 'Tech Partners',
		singular: 'Tech Partner',
		plural: 'Tech Partners'
	});

/**
 * Model Fields
 * @main Tech
 */
Tech.add({
	
	name: { type: String, required: true, initial: true },
    subheading: { type: String, required: true, initial: true, note: 'e.g "Digital sidewalk displays"'},
    description: { type: Types.Textarea, required: true, initial: true },
    image: { type: Types.CloudinaryImage, folder: 'beta-blocks/cms', autoCleanup:true, required: true, initial: true },
    website: { type: Types.Url, label: 'Website URL', required: true, initial: true }
    
});

/**
 * Model Registration
 */
Tech.defaultSort = '-createdAt';
Tech.defaultColumns = 'name';
Tech.register();
