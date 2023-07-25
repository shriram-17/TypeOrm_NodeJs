import { FastifyInstance, fastify } from "fastify";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import userRouter from "./routes/Users";
import fastifyCors from "@fastify/cors";


const app: FastifyInstance = fastify({logger:true});

AppDataSource.initialize()
  .then(async () => {
    console.log("Db is Connected");
  })
  .catch(error => console.log(error));

app.register(fastifyCors, {
    origin: "http://localhost:5173",
});

app.register(userRouter, { prefix: "/users" });

app.get("/", async (request, reply) => {
  reply.send("Hello world");
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Server Running at port 3000");
  } catch (err) {
    console.error(err);
  }
};
start();
