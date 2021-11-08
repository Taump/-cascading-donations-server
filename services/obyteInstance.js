import obyte from "obyte";

export default new obyte.Client(
  `wss://obyte.org/bb${process.env.TESTNET ? "-test" : ""}`,
  {
    testnet: process.env.TESTNET,
    reconnect: true,
  }
);