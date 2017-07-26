# Gitter Slack Relay

Super simple Node application that listens to Gitter's realtime message streaming API and forwards those messages into a Slack room. Useful when you've got a public Gitter room, use Slack regularly and want to get notifications there.

This currently does not go the other way, meaning no messages that you send to the Slack channel will go back to Gitter.

Original inspiration came from https://github.com/reactor/gitter-slack-relay which is the exact same thing written in Java with Spring Boot and Reactor.

## Usage

```sh
GITTER_ROOM_ID=<gitter room id> GITTER_TOKEN=<oauth bearer token> GITTER_ROOM_SLUG=<room URL slug> SLACK_HOOK_URL=<integration url> node gitter-to-slack.js
```

## Output

When you send a message in Gitter:

![gitter-message](https://user-images.githubusercontent.com/684275/28643934-1c78a700-721d-11e7-8321-a1f4b8e24f50.png)

you'll get the JSON payload from Gitter in your console:

```console
Received Gitter payload: {"id":"messageid","text":"this shows up in Slack","html":"this shows up in Slack","sent":"2017-07-26T21:00:50.512Z","fromUser":{"id":"userid","username":"phillipuniverse","displayName":"Phillip Verheyden","url":"/phillipuniverse","avatarUrl":"https://avatars-02.gitter.im/gh/uv/4/phillipuniverse","avatarUrlSmall":"https://avatars2.githubusercontent.com/u/684275?v=4&s=60","avatarUrlMedium":"https://avatars2.githubusercontent.com/u/684275?v=4&s=128","v":6,"gv":"4"},"unread":true,"readBy":0,"urls":[],"mentions":[],"issues":[],"meta":[],"v":1}
 forwarding to Slack
```

and see the message show up in Slack:

![slack-message](https://user-images.githubusercontent.com/684275/28644032-7b6c3614-721d-11e7-8ac3-24cbec61a36e.png)

## Environment Variables

- **GITTER_ROOM_ID** - This is a non-human-readable form of the Gitter room id referred to from the Gitter API. The easiest way to get this ID is to go to [the Gitter rooms API docs](https://developer.gitter.im/docs/rooms-resource), copy the example request and pick out the room id that you want to listen to 
- **GITTER_TOKEN** - The access token from https://developer.gitter.im/apps
- **GITTER_ROOM_SLUG**  - Used to build the link from the Slack message to the message in Gitter. If you are in a Gitter room then this value is the part after https://gitter.im/. So if a room is accessible at https://gitter.im/BroadleafCommerce/BroadleafCommerce then this value would be `BroadleafCommerce/BroadleafCommerce`
- **SLACK_HOOK_URL** - After creating a 'Custom Integration' in Slack (go to your team settings, Configure Apps -> Custom Integrations -> Add Configuration) this should be the 'Webhook URL' in the configuration settings

## Deploying

The easiest way to keep this running forever is to use Heroku's free tier. Since there is a start script specified in `package.json` you can deploy this with the Heroku CLI with:

```console
heroku create
heroku config:set GITTER_ROOM_ID=...
```
