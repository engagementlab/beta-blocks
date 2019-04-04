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

exports.send = function (req, res) {
    
    let mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN});
    let data = {
        from: '<' + req.body.email + '>',
        to: 'scott_margeson@emerson.edu',
        subject: 'BB Website: Test',
        text: req.body.message
    };

    mailgun.messages().send(data, function (error, body) {
        if(error) {
            console.error('Mailgun error: ' + error)
            res.status(500).json({err: error});
            return;
        }
            
        res.status(200).json({msg: 'Message sent.'});
    });
}