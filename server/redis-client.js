const redis = require('redis'),
	  client = redis.createClient(),
	  Bluebird = require('bluebird');

Bluebird.promisifyAll(redis.RedisClient.prototype);
Bluebird.promisifyAll(redis.Multi.prototype);

client.on('connect', function() {
	global.logger.info('Redis client connected');
});
client.on('error', function (err) {
	global.logger.error('Redis error', err);
});

module.exports = client;