"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
// const uniqueId = uuidv4();
const generateUniqueId = () => {
    const uniqueId = (0, uuid_1.v4)();
    const shortId = uniqueId.substr(0, 6); // Truncate to the first 6 characters
    return shortId;
};
const schema = new mongoose_1.default.Schema({
    shortId: {
        type: String,
        unique: true,
        required: true,
        default: generateUniqueId(),
    },
    destination: {
        type: String,
        required: true,
    },
});
const shortUrl = mongoose_1.default.model("shortUrl", schema);
exports.default = shortUrl;
