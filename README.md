# Unused or Maintained

Around 25 different Bernie Sanders groups got on this at one point I think, but it was way too spammy and I think everyone hated it.

I think this type of messaging is a bad substitute for Slack not having recursive teams. Somebody make Slack with recursive teams and then get a lot of people to use it! Thanks!

# broadcast
![alt tag](http://i.imgur.com/Qa2Civs.png)

### Bernie Groups Come Here ###
If you're a Bernie group, and want to join the Bernie Slack Broadcast, go here: http://wiki.4berniesanders.com/index.php/Broadcast

#### Setting It Up For Yourself ####
To set up broadcast for your own network of slacks, throw it on Heroku with the MongoLab addon.

Adding requires an Incoming Webook and Outgoing Webhook for each team, and that the Outgoing Webhook is triggered on `broadcast:`

After it's installed and running on Heroku, and the outgoing webhook is pointed to the proper place, type into Slack:
```
broadcast: --addteam {
  "domain": "<team domain>",
  "display": "My Team",
  "inToken": "<your outgoing webhook token here, random numbers and letters>",
  "outUrl": "https://hooks.slack.com/services/<whatever this is>"
}
```
*Note*: the team that sets this up will need to do it for themselves as well.

#### Future development ####
Some ideas:
* Maybe creating "groups" of Slacks for permanent targeted messaging?

I don't have plans to implement all of these in the immediate future. Pull requests welcome.
