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

    const consumer = kafka.consumer({ groupId: "test" });
    console.log("Connecting.....");
    await consumer.connect();
    console.log("Connected!");

    await consumer.subscribe({
      topic: "Users",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async (result) => {
        console.log(
          `RVD Msg ${result.message.value} on partition ${result.partition}`
        );
      },
    });
  } catch (ex) {
    console.error(`Something bad happened ${ex}`);
  } finally {
  }
}

run();

app.listen(process.env.SERVER_PORT, () => {
  console.log("Listening at http://localhost:" + process.env.SERVER_PORT);
});
