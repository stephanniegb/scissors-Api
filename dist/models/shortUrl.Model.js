import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
// const uniqueId = uuidv4();
const generateUniqueId = () => {
    const uniqueId = uuidv4();
    const shortId = uniqueId.substr(0, 6); // Truncate to the first 6 characters
    return shortId;
};
const schema = new mongoose.Schema({
    shortId: {
        type: String,
        unique: true,
        required: true,
        default: generateUniqueId,
    },
    destination: {
        type: String,
        required: true,
    },
    visitHistory: [
        {
            timestamp: {
                type: Number,
            },
        },
    ],
}, { timestamps: true });
const shortUrl = mongoose.model("shortUrl", schema);
export default shortUrl;
//# sourceMappingURL=shortUrl.Model.js.map