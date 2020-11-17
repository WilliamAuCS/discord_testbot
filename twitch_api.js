const express = require('express');
const bodyParser = require('body-parser');
const PORT = 1000;
const app = express();

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');
const twitch_clientID = fs.readFileSync('./credentials/twitch_clientID.key', { encoding: 'utf-8' });
const lark_userID = fs.readFileSync('./credentials/twitch_lark_userID.key', { encoding: 'utf-8' });
const twitch_client_secret = fs.readFileSync('./credentials/twitch_clientSecret.key', { encoding: 'utf-8' });
const twitch_get_bearer_token_URL = 'https://id.twitch.tv/oauth2/token?client_id=' + twitch_clientID + '&client_secret=' + twitch_client_secret + '&grant_type=client_credentials';
const twitch_subscribe_to_webhook_URL = 'https://api.twitch.tv/helix/webhooks/hub';
var bearerToken;

app.get('/', function(req, res) {
    res.send("hello from server");
});

app.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
});

app.get('/api/twitch/callback', (req, res) => {
    console.log("hey")
    res.status(200).send(req.query['hub.challenge']);
});

app.post('/api/twitch/callback', (req, res) => {
    console.log("hey2")
    res.status(200).send();
    console.log("got here")
    console.log(req);
})


const subscribe_lark = {
    "hub.callback": 'http://localhost:1000/api/twitch/callback',
    "hub.mode": 'subscribe',
    "hub.topic": 'https://api.twitch.tv/helix/streams?user_id=' + lark_userID,
    "hub.lease_seconds": 300,
};

exports.twitch_get_bearer_token = (callback) => {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            // Setting bearerToken
            bearerToken = JSON.parse(xmlHttp.responseText)["access_token"];
            twitch_subscribe_to_all();
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("POST", twitch_get_bearer_token_URL, true);
    xmlHttp.send(null);
};

function twitch_subscribe_to_all() {
    twitch_subscribe_to_webhook(subscribe_lark);
};

// Subscribes to webhook with given json
function twitch_subscribe_to_webhook(json_to_send) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 202) {
            console.log("202 request passed!");
            console.log(xmlHttp.responseText);
        }
        else if (xmlHttp.status == 400) {
            console.error(xmlHttp.responseText);
        }
    }
    xmlHttp.open("POST", twitch_subscribe_to_webhook_URL, true);
    xmlHttp.setRequestHeader('Client-ID', twitch_clientID);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + bearerToken);
    xmlHttp.send(JSON.stringify(json_to_send));
};
