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
      clientId: `Client-${Date.now()}`,
      brokers: ["my-cluster-kafka-bootstrap.kafka:9092"],
    });

    const consumer = kafka.consumer({ groupId: "input-test-group-9" });
    const producer = kafka.producer();

    console.log("Connecting.....");
    await consumer.connect();
    await producer.connect();
    console.log("Connected!");

    await consumer.subscribe({
      topic: "kinesis-input-topic",
      fromBeginning: true,
    });
    let msg = 0;
    await consumer.run({
      eachMessage: async (result) => {
        console.log(`Message -  ${result.message.value}`);
        let parserData = result.message.value;
        parserData = `[{key:${msg},value:${result.message.value}}]`;
        console.log("parserData....", parserData);
        msg++;

        let resultNew = await producer.send({
          topic: "kinesis-output-topic",
          messages: [
            {
              value: parserData,
            },
          ],
        });
        console.log(`Send Successfully! ${JSON.stringify(resultNew)}`);
      },
    });
  } catch (ex) {
    console.error(`Something bad happened ${ex}`);
  } finally {
  }
}

run();

app.listen(process.env.SERVER_PORT, () => {
  console.log("Listening at http://localhost:8080");
});
