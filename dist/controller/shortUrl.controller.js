var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import shortUrl from "../models/shortUrl.Model.js";
import analytics from "../models/analytics.model.js";
export function createShortUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { destination } = req.body;
        if (!destination)
            return res.status(400).json({ error: "url is rquired" });
        try {
            const newUrl = yield shortUrl.create({
                destination: destination,
                visitHistory: [],
            });
            return res.send(newUrl.toObject());
        }
        catch (error) {
            console.error("Failed to create short URL:", error);
            return res.sendStatus(500);
        }
    });
}
export function handleRedirect(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("handleRedirect controller function executed");
        const { shortId } = req.params;
        try {
            // const short = await shortUrl.findOne({ shortId }).lean();
            const short = yield shortUrl
                .findOneAndUpdate({
                shortId,
            }, {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            })
                .lean();
            if (!short) {
                return res.sendStatus(404);
            }
            yield analytics.create({ shortUrl: short._id });
            return res.redirect(short.destination);
        }
        catch (error) {
            console.error("Failed to handle redirect:", error);
            return res.sendStatus(500);
        }
    });
}
// export async function getAnalytics(req: Request, res: Response) {
//   try {
//     const analyticsData = await analytics.find().populate("shortUrl");
//     return res.json(analyticsData);
//   } catch (error) {
//     console.error("Failed to fetch analytics:", error);
//     return res.sendStatus(500);
//   }
// }
export function getAnalytics(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const analyticsData = yield analytics
                .find()
                .populate("shortUrl")
                .lean();
            let totalClicks = 0;
            const visitHistory = [];
            for (const data of analyticsData) {
                if (data.shortUrl &&
                    data.shortUrl.visitHistory &&
                    Array.isArray(data.shortUrl.visitHistory)) {
                    totalClicks += data.shortUrl.visitHistory.length;
                    visitHistory.push(...data.shortUrl.visitHistory);
                }
            }
            return res.json({
                totalClicks,
                ana: visitHistory,
            });
        }
        catch (error) {
            console.error("Failed to fetch analytics:", error);
            return res.sendStatus(500);
        }
    });
}
//# sourceMappingURL=shortUrl.controller.js.map