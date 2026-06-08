import express, { type Express } from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// In production, serve the built frontend from this same process so the whole
// app is a single deployable service. PUBLIC_DIR overrides the default path.
const publicDir =
  process.env.PUBLIC_DIR ??
  path.resolve(import.meta.dirname, "../../voice-platform/dist/public");

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  // SPA fallback: any non-API GET returns index.html so client routing works.
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    res.sendFile(path.join(publicDir, "index.html"));
  });
  logger.info({ publicDir }, "Serving frontend");
}

export default app;
