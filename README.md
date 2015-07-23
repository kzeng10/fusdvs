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

Good use cases:
- Quick, simple, no-strings-attached polling. 
- Attendance to meetings, events, etc.
- What to eat/order for meals


To do:
- Refresh the channel page _after_ password is entered (because user can simply go into console and hide the modal)
- Remove channels after x time of inactivity (set speak, history, pwstore, existingChannels to false/undefined, `setTimeout`, and `clearTimeout` and `setTimeout` again for each new interaction)
- Use socket namespaces for channels (look at comment in app.js)
- <b>need to organize code... (alerts, socket event listeners, etc)</b>
- Link to a backend db/redis if you need to scale
	- will need to re-figure out how to do timing out inactive channels
	- refer to known bugs for reason why I'm pushing this off for the future
- Mobile-friendly...
- Admin permissions
	- Authentication for removing people from the list (use `$rootScope.isCreator`)
	- Option to hide poll results from non-admin
- Option to have multi-select/checkboxes instead of text
- Switch to React

Known Bugs:
- With Memcachier:
	- On server restart, refreshing a pw-protected page automatically grants access
	- On server restart, connecting to memcachier fails either with EPIPE or ECONNRESET, likely related to first bug
- With Memcached Cloud:
	- can't connect at all...