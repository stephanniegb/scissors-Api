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
exports.getAnalytics = exports.handleRedirect = exports.createShortUrl = void 0;
const shortUrl_Model_1 = __importDefault(require("../models/shortUrl.Model"));
const analytics_model_1 = __importDefault(require("../models/analytics.model"));
function createShortUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { destination } = req.body;
        try {
            const newUrl = yield shortUrl_Model_1.default.create({ destination });
            return res.send(newUrl.toObject());
        }
        catch (error) {
            console.error("Failed to create short URL:", error);
            return res.sendStatus(500);
        }
    });
}
exports.createShortUrl = createShortUrl;
function handleRedirect(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("handleRedirect controller function executed");
        const { shortId } = req.params;
        try {
            const short = yield shortUrl_Model_1.default.findOne({ shortId }).lean();
            if (!short) {
                return res.sendStatus(404);
            }
            yield analytics_model_1.default.create({ shortUrl: short._id });
            return res.redirect(short.destination);
        }
        catch (error) {
            console.error("Failed to handle redirect:", error);
            return res.sendStatus(500);
        }
    });
}
exports.handleRedirect = handleRedirect;
function getAnalytics(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const analyticsData = yield analytics_model_1.default.find().populate("shortUrl");
            return res.json(analyticsData);
        }
        catch (error) {
            console.error("Failed to fetch analytics:", error);
            return res.sendStatus(500);
        }
    });
}
exports.getAnalytics = getAnalytics;
