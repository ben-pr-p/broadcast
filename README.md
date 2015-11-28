# broadcast
Multi-team Slack bot that enables sharing messages across different Slacks.

To use, clone the repository and change `teams.json`: 
```
[
  {
    "team_domain": "csfb",
    "team_display": "College Students for Bernie",
    "incoming": true,
    "outgoing": true,
    "notifications": false
  }
]
```

If team `csfb` has `incoming` enabled, the environment variable `csfb_url` will need to be set with the URL that incoming post requests should be sent to for the Slack API integration.

If team `csfb` has `outgoing` enabled, the environment variable `csfb_token` will need to be set with the outgoing token. 

If a team has `incoming` and `outgoing`, two integrations will be needed (one incoming and one outgoing). 

Making `notifications` false will remove all `@`'s from a message to prevent `@everyone`'s and stuff like that. 

Ideas for future development:
* Enable someone to broadcast a message to only certain Slacks
* Enable modification of permissions from the Slack command line
* Multi-tiered permission system with certain Slacks allowed to send messages to certain other Slacks

I don't have plans to implement any of these in the immediate future. Pull requests welcome.
