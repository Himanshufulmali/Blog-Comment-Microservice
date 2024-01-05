const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
const events = [];

app.post("/events", async(req, res) => {
  const event = req.body;

  events.push(event);

  await axios.post("http://localhost:4000/events", event).catch((err) => {
    console.log(err.message);
  });
  await axios.post("http://localhost:4001/events", event).catch((err) => {
    console.log(err.message);
  });
  await axios.post("http://localhost:4002/events", event).catch((err) => {
    console.log(err.message);
  });
  await axios.post("http://localhost:4003/events", event).catch((err) => {
    console.log(err.message);
  });
  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.status(200).send(events);
});

const startServer = () => {

  app.listen(4005, () => {
    console.log("Listening on 4005");
  });
}

startServer();