FUSDVS - Fremont Unified School District Voting System

Actually, more of a speaking indicator system, but the name just stuck.

This is the new and improved version of the original web app that runs on Google App Engine and runs AJAX calls to a data store, which is grossly inefficient for a small and simple task as this. That one will continue to be the main app until this one is finished (or at least has reached a satisfactory level).

This is also my first app made with Express, Angular, and Socket.io. (and first time using any of them)

You can find it running on OpenShift <a href='http://fusdvs-kzeng.rhcloud.com'>here</a>.

To run on your local machine:

1. Make sure you have <b>node.js</b> and <b>npm</b> installed (get it from the <a href='http://nodejs.org'>Node.js website</a>, version 0.10 and up recommended)
2. Fork this repo, `cd` into the main directory and run `npm install`
3. After it's done installing all the dependencies, run `node index.js`
4. Go to `localhost:3000` in your web browser!

As an added bonus, I would recommend you to get <a href='https://github.com/remy/nodemon'>nodemon</a>, which is really useful if you plan on tweaking/modifying this web app (which you probably would be doing if you're running this on your local machine).

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

To do:
- Admin permissions
	- Authentication for removing people from the list
	- Ability to change channels
	- Password-protected channels
		- alert upon changing channels
		- prevent creating channels that already exist
- Mobile-friendly...
- Or, put the list of people in a separate admin page (with password) and adding names to another page
