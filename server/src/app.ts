import compression from "compression";
import cors from "cors";
import express, { Express } from "express";
import logger from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import api from "./api";
import { specs } from "./docs-config";

const app: Express = express();

app.set("env", process.env.NODE_ENV);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(compression());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(
  "/",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
  express.static(path.join(__dirname, "../public"), { redirect: false }),
);

app.use(api);

export default app;
