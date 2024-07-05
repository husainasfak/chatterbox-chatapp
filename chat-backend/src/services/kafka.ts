import { Consumer, Kafka, logLevel, Producer } from "kafkajs";
import prismaClient from "./db";
import fs from "fs";
import path from "path";
import MessageService from "./message";
const kafka = new Kafka({
  brokers: ["kafka-28bd53ff-asfakhusain99-66d6.i.aivencloud.com:20486"],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },
  sasl: {
    username: "avnadmin",
    password: "AVNS_X6xg_VzNq22LY1yPL9-",
    mechanism: "plain",
  },
});

// const kafka = new Kafka({
//   brokers: ["kind-lark-10485-us1-kafka.upstash.io:9092"],
//   ssl: true,
//   sasl: {
//     mechanism: "scram-sha-256",
//     username: "a2luZC1sYXJrLTEwNDg1JDLPZ1D-qsR1j6Ks0cnsHRgiQF01ZdzobV0bG48p3vg",
//     password: "YTk2OTQ1ZmItYTJkYi00YTUwLWI2YTMtYTYzYmM5ZDY1ZmE2",
//   },
//   logLevel: logLevel.ERROR,
// });

let producer: null | Producer = null;

export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "chat-app",
  });
  return true;
}

export async function startMessageConsumer() {
  const privateMessage = new MessageService();
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "chat-app", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      try {
        const messageData = JSON.parse(message.value?.toString())

        await privateMessage.sendMessage(messageData)
      } catch (err) {
        console.log("Something is wrong");
        pause();
        setTimeout(() => {
          consumer?.resume([{ topic: "chat-app" }]);
        }, 60 * 1000);
      }
    },
  });
}
export default kafka;
