import fastify from "fastify";
import store from "./store.js";

// Create instance
const fastifyInstance = fastify({ logger: false });

// Declare a route
fastifyInstance.get('/popular', async () => {
  const data = store.get();
  return { data }
})

// Run the server!
export default async () => {
  try {
    await fastifyInstance.listen(process.env.PORT);
  } catch (err) {
    fastifyInstance.log.error(err);
    process.exit(1);
  }
}