Version 0.06, 7/18/2015:
- tossed out memcachier because of frustrations from EPIPE and ECONNRESET errors
- went to using in-memory dict store
- correctly switches and enters to new channels

Version 0.05, 7/18/2015:
- ability to create new channels
- password-protected channels
- made this changelog

Version 0.04, 7/15/2015:
- Added channels, done by a url param
- Modified spacing

Version 0.03, 7/14/2015:
- Did basic bootstrap styling
- Made add button bigger
- decided to stop being lazy and finish this up

Version 0.02, 3/16/2015:
- Added history table and time stamps
- Hit enter to submit name
- Includes both dropdown menu and text entry for names not in the list
- Prompt user before removing name from list
- Clear all and clear history buttons with prompting

Version 0.01, 3/15/2015:
- Configured working Express server with valid environment variables and basic routes
- Configured basic views and controllers with Angular
- Got socket.io working!
- Includes list of JSON objects of all the people in line to speak just for reference