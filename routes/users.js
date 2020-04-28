const User = require('../models/users') ;
const AWS = require('aws-sdk');
const express = require('express');
const router = express.Router();
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: 'eu-west-3'});

router.get('/', async (req, res) => {
    let users = [];
    const params = {
        TableName: "users"
    };
    const { Items } = await dynamodb.scan(params).promise();
    let temp = {};
    users = Items.map(({ mobile, role, email, name }) => {
        temp = { role: role.S, email: email.S, name: name.S };
        if (mobile) temp['mobile'] = mobile.S;
        return temp;
    });
    res.send(s);
});

router.post('/', async (req, res) => {

    const usr = new User(req.body);
    const validationError = usr.validate();

    if(validationError) return res.status(400).send(validationError);
    
    let params = {
        Item: {
            "name": {
                S: usr.name
            },
            "email": {
                S: usr.email
            },
            "role": {
                S: usr.role
            }
        },
        TableName: "users"
    };
    if(usr.mobile) params.Item['mobile'] = {S: usr.mobile};
    await dynamodb.putItem(params).promise();
    res.status(201).send(usr);
});

router.put('/:email', async (req, res) => {

    /** Search for user, if user does not exist then return 404 resource not found */
    const params = {
        Key: {
            "email": {
                S: req.params.email
            }
        },
        TableName: "users"
    };
    const usr = await dynamodb.getItem(params).promise();
    if(!Object.keys(usr).length) return res.status(404).send(`${req.params.email} doesn't exists.`);

    /** Validate input using schema*/
    req.body['email'] = req.params.email;
    const newUsr = new User(req.body);
    const validationError = newUsr.validate();

    if(validationError) return res.status(400).send(validationError);

    /** Update it and return the updated user */
    let updateParams = {
        Item: {
            "name": {
                S: newUsr.name
            },
            "email": {
                S: newUsr.email
            },
            "role": {
                S: newUsr.role
            }
        },
        TableName: "users"
    };
    if(newUsr.mobile) updateParams.Item['mobile'] = {S: newUsr.mobile};
    await dynamodb.putItem(updateParams).promise();
    res.status(201).send(newUsr);
});

router.delete('/:email', async (req, res) => {

    /** Search for user, if user does not exist then return 404 resource not found */
    const params = {
        Key: {
            "email": {
                S: req.params.email
            }
        },
        TableName: "users"
    };
    const usr = await dynamodb.getItem(params).promise();
    if(!Object.keys(usr).length) return res.status(404).send(`${req.params.email} doesn't exists.`);

    /** Delete the user via primary key(email) */
    const delParams = {
        Key: {
            "email": {
                S: req.params.email
            }
        },
        TableName: "users"
    };
    await dynamodb.deleteItem(delParams).promise();
    res.send({success: true});
});

module.exports = router;