# QuickJoin
A web app to organize online classes and easily join them

Running live at: quickjoin.me

## Motivation
Navigating to a your schools site everytime to join an online
class can become repetitive and annoying, so I developed this
small web app to store class links in an accessible web app.
Normally you can copy and paste to a textfile and easily open
classroom links from there, but this app has the added advantage
of allowing access from any computer with an internet connection.

## App Structure 
The frontend was coded with HTML, CSS, plain Javascript, and a little
EJS for error generation when logging in, signing up, or resetting a
password. The site is not completely static, with the dashboard utitlizing
the Fetch API to add, edit, and remove class links. Javascript frameworks
like React and Vue were considered, but to gain a better understanding
of Javascript, I decided to go with no framework. To use npm dependencies
on the frontend, I used webpack to bundle all required modules. Therefore all
the javascript for the frontend is found in the 'web' folder, and is bundled into public/build.
The html pages are located under the 'views' direcotry while css is already located in public.

On the backend an Express instance handles requests and ajax calls. When
deployed on a production server, Nginx is used as a reverse proxy, for
gzip compression, and to upgrade all http connections to use tls. A Postgres 
database instance stores all relevant user information.
A Postfix mail server is used to send confirmation and reset password emails. It acts
as a send-only server, and thus cannot be replied to. Dovecot was used to encrypt
the emails sent, and OpenDKIM to sign emails so that Gmail wouldn't mark them as spam.

## Schema
The Postgres database setup is quite simple. There is a table to store user logins and passwords, a table
to store all user meeting links, and a table for sessions. There is a relation between user logins and 
user links, which is represented by a foreign key in user links that references the user id in the user
info table. This way only confirmed users can have their links added to the database.

## Cookies and Sessions
A session is only saved to the database when a user is able to login.
Sessions last for 30 days so that joining classes aren't slowed down
by frequent logins. Cookies for sessions are automatically managed by
the express-session dependency. When resetting a password, a cookie with a random token
is set manually to allow a user to access the resetpassword endpoint with a POST
request.

## Building and Running
Ensure that you have a Postgres database running and a Postfix server to send mail. Postfix isn't
a requirement and instead an api that sends emails could be used. Nginx is also optional in this
environment setup.

Use `npm install` to download all required dependencies for the Express server
and the frontend.

Next use `npm run build` so that webpack bundles the frontend javascript into the public/build directory

Then use `npm start` to launch the server which will have it run at
localhost:8080 or whatever PORT is configured to
