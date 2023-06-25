import { v4 as uuidv4 } from "uuid";
import { createShortUrl, getAnalytics, handleRedirect, } from "../controller/shortUrl.controller.js";
import validateResource from "../middleware/validateResources.js";
import shortUrlSchema from "../schemas/createShortUrl.schema.js";
const generateUniqueId = () => {
    const uniqueId = uuidv4();
    const shortId = uniqueId.replace(/-/g, "").slice(0, 6);
    // const shortId = uniqueId.substr(0, 6); // Truncate to the first 6 characters
    return shortId;
};
function routes(app) {
    app.get("/healthcheck", (req, res) => {
        return res.send(`App is healthy and strong ${generateUniqueId()}`);
    });
    // app.post("/shorten-url", (req, res) => {
    //   const destination = req.body.destination;
    //   return res.send(`URL shortened successfully: ${destination}`);
    // });
    app.post("/api/url", validateResource(shortUrlSchema), createShortUrl);
    app.get("/:shortId", handleRedirect);
    app.get("/api/analytics/:shortId", getAnalytics);
}
export default routes;
//# sourceMappingURL=index.js.map