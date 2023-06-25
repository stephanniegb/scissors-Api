import mongoose from "mongoose";
// import { shortURL } from "./shortUrl.Model.js";

// interface Analytics extends Document {
//   shortUrl: shortURL;
// }
const schema = new mongoose.Schema(
  {
    shortUrl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shortUrl",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const analytics = mongoose.model("analytics", schema);

export default analytics;
