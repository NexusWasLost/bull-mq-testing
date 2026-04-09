import express from "express";
import morgan from "morgan";
import { Queue } from "bullmq";
import db from "./db.js";
import { nanoid } from "nanoid";

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

//create a queue named foo
const q = new Queue("db-exec");

app.post("/", async function(req,res){
    try{
        const uniqueName = nanoid();

        await q.add("db-item", { item: uniqueName });
        res.status(200).json({ message: "Data Added", data: uniqueName });
    }
    catch(error){
        console.log("[ERROR]: ", error);
        res.status(500).json({ message: "Server Err" });
    }
});

app.get("/get-data", async function(req,res){
    try{
        const result = db.prepare(`
            SELECT COUNT(*) FROM test_users;
        `).all();

        res.status(200).json({ message: "Data Retrieved", data: result });
    }
    catch(error){
        console.log("[ERROR]: ", error);
        res.status(500).json({ message: "Server Err" });
    }
});

app.delete("/del-data", async function(req, res){
    try{
        const result = db.prepare(`
            DELETE FROM test_users;
        `).run();

        res.status(200).json({ message: "Data Deleted", data: result });
    }
    catch(error){
        console.log("[ERROR]: ", error);
        res.status(500).json({ message: "Server Err" });
    }
});

app.listen(3000, function(){
    console.log("App Listening on PORT 3K...");
})
