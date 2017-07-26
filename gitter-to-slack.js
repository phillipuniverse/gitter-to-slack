var https = require('https');
var request = require('request');
var moment = require('moment');

var roomId    = process.env.GITTER_ROOM_ID;
var token     = process.env.GITTER_TOKEN;
var gitterRoomSlug = process.env.GITTER_ROOM_SLUG;
var slackHookUrl = process.env.SLACK_HOOK_URL;
var heartbeat = " \n";

var options = {
  hostname: 'stream.gitter.im',
  port:     443,
  path:     '/v1/rooms/' + roomId + '/chatMessages',
  method:   'GET',
  headers:  {'Authorization': 'Bearer ' + token}
};

var req = https.request(options, function(res) {
  res.on('data', function(chunk) {
    var msg = chunk.toString();
    if (msg !== heartbeat) {
      console.log('Received Gitter payload: ' + msg + ' forwarding to Slack');
      var gitterData = JSON.parse(msg);
      var slackMessage = '<https://gitter.im/' + gitterRoomSlug + '?at=' + gitterData.id;
      slackMessage += '|' + gitterData.fromUser.displayName;
      var sentDate = moment(gitterData.sent).format('MMM-D h:mm A')
      slackMessage += ' [' + sentDate + ']>';
      slackMessage += ': ' + gitterData.text;
      request.post(slackHookUrl,
        { json: { text: slackMessage} },
        function (err, resp, body) {
          if (err) {
            console.log(err);
          }
        }
      )
    }
  });
});

req.on('error', function(e) {
  console.log('Something went wrong: ' + e.message);
});

req.end();
