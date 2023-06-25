"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const shortUrl_controller_1 = require("../controller/shortUrl.controller");
const validateResources_1 = __importDefault(require("../middleware/validateResources"));
const createShortUrl_schema_1 = __importDefault(require("../schemas/createShortUrl.schema"));
const generateUniqueId = () => {
    const uniqueId = (0, uuid_1.v4)();
    const shortId = uniqueId.substr(0, 6); // Truncate to the first 6 characters
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
    app.post("/api/url", (0, validateResources_1.default)(createShortUrl_schema_1.default), shortUrl_controller_1.createShortUrl);
    app.get("/:shortId", shortUrl_controller_1.handleRedirect);
    app.get("/api/analytics", shortUrl_controller_1.getAnalytics);
}
exports.default = routes;
