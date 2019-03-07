'use strict';
/**
 * Beta Blocks API server
 * Developed by Engagement Lab, 2019
 * ==============
 * App start
 *
 * @author Johnny Richardson
 *
 * ==========
 */

// Load .env vars
if(process.env.NODE_ENV !== 'test')
	require('dotenv').load();

const winston = require('winston'),
logFormat = winston.format.combine(
	winston.format.colorize(),
	winston.format.timestamp(),
	winston.format.align(),
	winston.format.printf((info) => {
		const {
		timestamp, level, message, ...args
		} = info;

		const ts = timestamp.slice(0, 19).replace('T', ' ');
		return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
	}),
);
global.logger = winston.createLogger({
	level: 'info',
	format: logFormat,
	transports: [
		new winston.transports.Console()
	]
});

const bootstrap = require('@engagementlab/el-bootstrapper'), express = require('express');

var app = express();
bootstrap.start(
	'./config.json', 
	app,
	__dirname + '/', 
	{
		'name': 'Beta Blocks API server CMS'
	},
	() => {
		app.listen(process.env.PORT);
	}
);