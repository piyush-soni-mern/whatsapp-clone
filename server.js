// Importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";

// App Config
const app = express();
const port = process.env.PORT || 5000;

const pusher = new Pusher({
  appId: "1149088",
  key: "e990b3d3b7ba099aef5a",
  secret: "13fc38a559695a51b9eb",
  cluster: "eu",
  useTLS: true,
});

// Middleware
app.use(express.json());
app.use(cors());

// DB Config
const connection_url =
  "mongodb+srv://admin:CErYKrQDKoQwdqib@cluster0.cjg4o.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB Connected");
  const msgCollection = db.collection("messagecontents");
  const changeSteam = msgCollection.watch();
  changeSteam.on("change", (change) => {
    console.log("change occured");

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error trigerring pusher");
    }
  });
});

// ????

// API Routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// Heroku (Serve static files)

if (process.env.NODE_ENV == "production") {
  app.use(express.static("whatsapp-frontend/build"));
  //   const path = require("path");
  //   app.get("*", (req, res) => {
  //     res.sendFile(
  //       path.resolve(__dirname, "whatsapp-frontend", "build", "index.html")
  //     );
  //   });
}
// Listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
