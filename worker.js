import { Worker } from "bullmq";
import IORedis from "ioredis";
import db from "./db.js";

const connection = new IORedis({ maxRetriesPerRequest: null });

function attachedListenersToWorker(worker) {
  worker.on("completed", function (job) {
    console.log(`${job.id} has completed!`);
  });

  worker.on("failed", function (job, err) {
    console.log(`${job.id} has failed with ${err.message}`);
  });
}

function writeAndFlush() {
  //store the global state in a local array and empty the global state
  const localBatch = [...batch];
  batch = [];

  try {
    //return a map of "(?)" for each element then convert them to a string separated by ',' !
    let placeholders = localBatch.map(function (item) { return "(?)"; }).join(",")
    db.prepare(`
    INSERT INTO test_users(name)
    VALUES ${placeholders}
    `).run(...localBatch);
  }
  catch (error) {
    console.log("[WRITE AND FLUSH ERR]: ", error);
    batch = [...localBatch, ...batch];
  }

  DBexecCounter++;
  console.log("Batch Count Written: ", DBexecCounter);
}

let DBexecCounter = 0;
const BATCH_SIZE = 30;
let batch = [];

const worker = new Worker("db-exec", function (job) {
  batch.push(job.data.item);

  if (batch.length < BATCH_SIZE) return;

  writeAndFlush();

}, { connection, concurrency: 1 });
attachedListenersToWorker(worker);

//Do a fallback flush every 10 seconds
setInterval(function () {
  if (batch.length > 0) {
    console.log("Fallback Flush Triggred");
    writeAndFlush();
  }
}, 10000);
