import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import {
  createShortUrl,
  getAnalytics,
  handleRedirect,
  createCustomUrl,
  handleCustomRedirect,
} from "../controller/shortUrl.controller.js";
import validateResource from "../middleware/validateResources.js";
import shortUrlSchema from "../schemas/createShortUrl.schema.js";

const generateUniqueId = () => {
  const uniqueId = uuidv4();
  const shortId = uniqueId.replace(/-/g, "").slice(0, 6);
  return shortId;
};

function routes(app) {
  app.get("/healthcheck", (req, res) => {
    return res.send(`App is healthy and strong ${generateUniqueId()}`);
  });
  app.post("/api/url", validateResource(shortUrlSchema), createShortUrl);

  app.get("/:custom", handleCustomRedirect);
  // handleCustom redirect

  app.get("/:shortId", handleRedirect);

  app.get("/api/analytics/:shortId", getAnalytics);
}
export default routes;
