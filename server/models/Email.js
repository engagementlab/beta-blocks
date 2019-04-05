'use strict';
/**
 * Beta Blocks API server
 * 
 * Email page Model
 * @module email
 * @class email
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = global.keystone;
var Types = keystone.Field.Types;

/**
 * email model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Email = new keystone.List('Email', {
    label: 'Email Archive',
    singular: 'Email',
    nodelete: true,
    nocreate: true,
    autokey: {
        path: 'key',
        from: 'datetime',
        unique: true
    },
    map: { name: 'datetime' }
});

/**
 * Model Fields
 * @main Email
 */
Email.add({
    datetime: {
        type: String,
        required: true,
        initial: true,
        noedit: true
    },
    type: {
        type: String,
        required: true,
        initial: true,
        noedit: true
    },
    message: {
        type: Types.Textarea,
        required: true,
        initial: true,
        noedit: true
    }
});

/**
 * Model Registration
 */
Email.defaultSort = 'datetime';
Email.defaultColumns = 'datetime, type';
Email.register();