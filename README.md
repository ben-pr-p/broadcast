# broadcast
Multi-team Slack bot that enables sharing messages across different Slacks.

To use, clone the repository and change `teams.json`: 
```
[
  {
    "team_domain": "csfb",
    "team_display": "College Students for Bernie",
    "incoming": true,
    "outgoing": true
  }
]
```

If team `csfb` has `incoming` enabled, the environment variable `csfb_url` will need to be set with the URL that incoming post requests should be sent to for the Slack API integration.

If team `csfb` has `outgoing` enabled, the environment variable `csfb_token` will need to be set with the outgoing token. 

If a team has `incoming` and `outgoing`, two integrations will be needed (one incoming and one outgoing). 
