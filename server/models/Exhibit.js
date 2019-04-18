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
		nodelete: true,
		nocreate: true
	});

/**
 * Model Fields
 * @main Exhibit
 */
Exhibit.add({
	
	name: { type: String, default: 'Exhibit Info', hidden: true, required: true, initial: true },

	seeInfo: { type: Types.Markdown, required: true, initial: true},
	exploreInfo: { type: Types.Markdown, required: true, initial: true},
	reflectInfo: { type: Types.Markdown, required: true, initial: true},
	gatherInfo: { type: Types.Markdown, required: true, initial: true},
	tinkerInfo: { type: Types.Markdown, required: true, initial: true}

});

Exhibit.schema.add({
	see: Array,
	explore: Array,
	reflect: Array,
	gather: Array,
	tinker: Array
});

Exhibit.schema.pre('save', function(next) {

	this.see = this.seeInfo.html.split("\n");
	this.explore = this.exploreInfo.html.split("\n");
	this.reflect = this.reflectInfo.html.split("\n");
	this.gather = this.gatherInfo.html.split("\n");
	this.tinker = this.tinkerInfo.html.split("\n");

	next();

});
/**
 * Model Registration
 */
Exhibit.defaultSort = '-createdAt';
Exhibit.defaultColumns = 'name';
Exhibit.register();
