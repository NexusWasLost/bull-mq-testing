import { Worker } from "bullmq";
import IORedis from "ioredis";
import db from "./db.js";

const connection = new IORedis({ maxRetriesPerRequest: null });

function attachedListenersToWorker(worker) {
  worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
  });

  worker.on('failed', (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
  });

  worker.on("drained", () => {
    let placeholder;

    if (batch.length > 0) {
      placeholder = batch.map(function (item) {
        return `(?)`;
      }).join(",");

      db.prepare(`
        INSERT INTO test_users(name)
        VALUES ${placeholder}
      `).run(...batch);

      DBexecCounter++;
      batch = [];
      console.log("DB Hit Count: ", DBexecCounter);
    }
  })
}

let DBexecCounter = 0;
const BATCH_SIZE = 20;
let batch = [];

const worker = new Worker("db-exec", function (job) {

  batch.push(job.data.item);
  let placeholder;

  if (batch.length >= BATCH_SIZE) {
    placeholder = batch.map(function (item) {
      return `(?)`;
    }).join(",");

    db.prepare(`
      INSERT INTO test_users(name)
      VALUES ${placeholder}
    `).run(...batch);

    DBexecCounter++;
    batch = [];
    console.log("DB Hit Count: ", DBexecCounter);
  }

}, { connection, concurrency: 3 });
attachedListenersToWorker(worker);
