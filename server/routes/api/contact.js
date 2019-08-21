'use strict';
/**
 * Developed by Engagement Lab, 2019
 * ==============
 * Route to send email
 * @class api
 * @author Johnny Richardson
 *
 * ==========
 */

const _ = require('underscore'),
    keystone = global.keystone;

exports.send = function (req, res) {

    let type = req.body.type;
    let subjectPostfix = type === 'Tech' ? 'Tech Feedback' : (type + ' Inquiry');
    let subjectLine = 'BB Website: ' + subjectPostfix;
    // let body = '<img src="http://bit.ly/2YKMNyC" style="width:120px"><h4>Form Message</h4>';

    delete req.body.type;

    let body = '';
    _.each(_.keys(req.body), (key) => {
        body += (key.charAt(0).toUpperCase() + key.slice(1) + ': ' + req.body[key]) + '\n';
    });

    let mailgun = require('mailgun-js')({
        apiKey: process.env.MAILGUN_KEY,
        domain: process.env.MAILGUN_DOMAIN
    });
    let validEmail = (req.body.email !== undefined && req.body.email.length > 0);
    let data = {
        from: '<' + (validEmail ? req.body.email : 'noreply@betablocks.city') + '>',
        to: type === 'Tech' ? process.env.MAILGUN_CONTACT_TECH : process.env.MAILGUN_CONTACT,
        subject: subjectLine,
        text: body
    };

    // Save message to CMS archive
    keystone.createItems({
        Email: [{
            datetime: new Date(Date.now()).toDateString() + ' ' + new Date(Date.now()).toLocaleTimeString(),
            type: type,
            message: body
        }]
    }, { verbose: false}, (err, stats) => {
        if (err) throw new Error('panic!', err);
    })

    mailgun.messages().send(data, function (error, body) {
        if (error) {
            console.error('Mailgun error: ' + error)
            res.status(500).json({
                err: error
            });
            return;
        }

        res.status(200).json({
            msg: 'Message sent.'
        });
    });
}