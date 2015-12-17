# broadcast
![alt tag](http://i.imgur.com/Qa2Civs.png)

If you're a Bernie group, go here: http://wiki.4berniesanders.com/index.php/Broadcast

To use, throw it on Heroku with the MongoLab addon.

Add teams by typing into Slack
```
broadcast: --addteam {
  "domain": "<team domain>",
  "display": "My Team",
  "inToken": "<your outgoing webhook token here, random numbers and letters>",
  "outUrl": "https://hooks.slack.com/services/<whatever this is>"
}
```

Ideas for future development:
* Maybe creating "groups" of Slacks for permanent targeted messaging?

I don't have plans to implement all of these in the immediate future. Pull requests welcome.
