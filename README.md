# Smiley-Inc
### [Heroku Site](https://nameless-crag-8753.herokuapp.com/)

#### Local Database Setup Instructions
  *will change once a script is set up to do most of this automatically*
 1. Type `psql` in a terminal to bring up postgres.
 2. Run the following commands:
  `CREATE DATABASE OriginateIdol;`
  `\connect OriginateIdol;`
  `CREATE USER ointerns WITH PASSWORD 'tacos';`
  'ALTER ROLE ointerns Superuser;`
 3. Run the rest of the commands in DB-Setup.sql (maybe).
