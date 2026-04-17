# BullMQ-testing

I wanted to try BullMQ and do batch writes to reduce DB hits

Check out BullMQ here: https://bullmq.io/

## Get Started

- Clone the repo and navigate into it, then install dependencies using `npm install`. <br>
The root (`\`) contains all the sorce code. <br>
The "SQLite Database" folder contains the actual database (`.db` file).

Pre-Requisties: [Node.js](https://nodejs.org/en), [Redis](https://redis.io/), [Postman](https://www.postman.com/), [Grafana K6](https://k6.io/) and [SQLite](https://www.sqlite.org/).

## How to Test ?

Postman Collection, SQLite Database and K6 script is already included in the repo

`server.js` file is the entry point.

3 Endpoints

- `/` (POST): Generates unqiue value using [nanoid](https://www.npmjs.com/package/nanoid) and pushes it to queue, picked up and executed by Worker.

- `/get-data` (GET): Gets the count of total number of records in the DB.

- `/del-data` (DELETE): Deletes every record present in the DB.

Start the server using `npm run dev` and on a separate terminal run `node worker.js` to activate the worker.

Hit the `del-data` route using Postman to clear any existing data in the DB.

*NOTE there must be a local running redis server !! If on Windows use Docker to spin up a container running a Redis server.*

View: [Running a Redis container](https://redis.io/tutorials/operate/orchestration/docker/).

## Running the test script using K6

Finally to test the actual batch writes, In a terminal run `k6 run test.js` to run the test !

The base test is set to 115 VUs and 60s duration.

After test is finished switch to the terminal that the worker is active on and see total writes. To reset the write counter the worker is needed to be restarted.

## Changing Test Duration and VUs

Just open `test.js` and change VUs and duration to anything required. Save and run again !
