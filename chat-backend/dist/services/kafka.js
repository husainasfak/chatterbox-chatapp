"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMessageConsumer = exports.produceMessage = exports.createProducer = void 0;
const kafkajs_1 = require("kafkajs");
const message_1 = __importDefault(require("./message"));
// const kafka = new Kafka({
//   brokers: ["kafka-28bd53ff-asfakhusain99-66d6.i.aivencloud.com:20486"],
//   ssl: {
//     ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
//   },
//   sasl: {
//     username: "avnadmin",
//     password: "AVNS_X6xg_VzNq22LY1yPL9-",
//     mechanism: "plain",
//   },
// });
const kafka = new kafkajs_1.Kafka({
    // brokers: ["kafka-28bd53ff-asfakhusain99-66d6.i.aivencloud.com:20486"],
    // ssl: {
    //   ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
    // },
    // sasl: {
    //   username: "avnadmin",
    //   password: "AVNS_X6xg_VzNq22LY1yPL9-",
    //   mechanism: "plain",
    // },
    clientId: 'chattrbox',
    brokers: ["localhost:9092"]
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
let producer = null;
function createProducer() {
    return __awaiter(this, void 0, void 0, function* () {
        if (producer)
            return producer;
        const _producer = kafka.producer();
        yield _producer.connect();
        producer = _producer;
        return producer;
    });
}
exports.createProducer = createProducer;
function produceMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = yield createProducer();
        yield producer.send({
            messages: [{ key: `message-${Date.now()}`, value: message }],
            topic: "chat-app",
        });
        return true;
    });
}
exports.produceMessage = produceMessage;
function startMessageConsumer() {
    return __awaiter(this, void 0, void 0, function* () {
        const privateMessage = new message_1.default();
        const consumer = kafka.consumer({ groupId: "default" });
        yield consumer.connect();
        yield consumer.subscribe({ topic: "chat-app", fromBeginning: true });
        yield consumer.run({
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ message, pause }) {
                var _b;
                if (!message.value)
                    return;
                try {
                    const messageData = JSON.parse((_b = message.value) === null || _b === void 0 ? void 0 : _b.toString());
                    yield privateMessage.sendMessage(messageData);
                }
                catch (err) {
                    console.log("Something is wrong");
                    pause();
                    setTimeout(() => {
                        consumer === null || consumer === void 0 ? void 0 : consumer.resume([{ topic: "chat-app" }]);
                    }, 60 * 1000);
                }
            }),
        });
    });
}
exports.startMessageConsumer = startMessageConsumer;
exports.default = kafka;
