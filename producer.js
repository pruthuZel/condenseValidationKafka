//const Kafka = require("kafkajs").Kafka
const { Kafka } = require("kafkajs");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

async function run() {
  try {
    const kafka = new Kafka({
      clientId: "myapp",
      brokers: ["my-cluster-kafka-bootstrap.kafka:9092"],
    });
    const producer = kafka.producer();
    console.log("Connecting.....");
    await producer.connect();
    console.log("Connected!");
    //A-M 0 , N-Z 1
    let msg = 0;
    let messageValue = `${msg} + Hello`
    let result;
    setInterval(async () => {
      result = await producer.send({
        topic: "Users",
        messages: [
          {
            value: messageValue,
          },
        ],
      });
      console.log(`Send Successfully! ${JSON.stringify(result)}`);
      msg++;
    }, 10000);

    // await producer.disconnect();
  } catch (ex) {
    console.error(`Something bad happened ${ex}`);
  }
}
run();

app.listen(process.env.SERVER_PORT, () => {
  console.log("Listening at http://localhost:" + process.env.SERVER_PORT);
});
