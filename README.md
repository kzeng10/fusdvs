FUSDVS - Fremont Unified School District Voting System

Actually, more of a speaking indicator system, but the name just stuck.

This is the new and improved version of the original web app that runs on Google App Engine and runs AJAX calls to a data store, which is grossly inefficient for a small and simple task as this. That one will continue to be the main app until this one is finished (or at least has reached a satisfactory level).

This is also my first app made with Express, Angular, and Socket.io. (and first time using any of them)

Version 0.01, 3/15/2015:
	- Configured working Express server with valid environment variables and basic routes
	- Configured basic views and controllers with Angular
	- Got socket.io working!

To do:
	- Styling and formatting (Katherine and Valerie help again) (Bootstrap this time?)
	- Press enter key to add your name (jQuery?)
	- Authentication for removing people from the list
	- Or, put the list of people in a separate admin page (with password) and adding names to another page