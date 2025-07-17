//const Kafka = require("kafkajs").Kafka
const {Kafka} = require("kafkajs")

async function run(){
    try
    {
         const kafka = new Kafka({
              "clientId": "myapp",
              "brokers" :["my-cluster-kafka-bootstrap.kafka:9092"],
              sasl: {
                mechanism: 'PLAIN',
                username: 'my-connect-user',
                password: '3uuqhR2WHaxzC',
              },
         })
dsafasdfasdf
        const admin = kafka.admin();
        console.log("Connecting.....")
        console.log("Validation")
        await admin.connect()
        console.log("Connected!")
        //A-M, N-Z
        await admin.createTopics({
            "topics": [{
                "topic" : "kinesis-input-topic"
            }]
        })
        console.log("Created Successfully!")
        await admin.disconnect();
    }
    catch(ex)
    {
        console.error(`Something bad happened ${ex}`)
    }
    finally{
        process.exit(0);
    }
}
run();
