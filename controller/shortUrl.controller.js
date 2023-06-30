import shortUrl from "../models/shortUrl.Model.js";
import analytics from "../models/analytics.model.js";

export async function createShortUrl(req, res) {
  const { destination, custom } = req.body;
  if (!destination) return res.status(400).json({ error: "url is rquired" });

  try {
    const newUrl = await shortUrl.create({
      destination: destination,
      custom: custom,
      visitHistory: [],
    });
    return res.send(newUrl.toObject());
  } catch (error) {
    console.error("Failed to create short URL:", error);
    return res.sendStatus(500);
  }
}

export async function handleRedirect(req, res) {
  console.log("handleRedirect controller function executed");
  const { shortId, custom } = req.params;

  try {
    let short;

    if (shortId) {
      // Find by shortId
      short = await shortUrl
        .findOneAndUpdate(
          {
            shortId,
          },
          {
            $push: {
              visitHistory: {
                timestamp: Date.now(),
              },
            },
          }
        )
        .lean();
    } else if (custom) {
      // Find by custom
      short = await shortUrl
        .findOneAndUpdate(
          {
            custom,
          },
          {
            $push: {
              visitHistory: {
                timestamp: Date.now(),
              },
            },
          }
        )
        .lean();
    }

    if (!short) {
      return res.sendStatus(404);
    }

    await analytics.create({ shortUrl: short._id });

    return res.redirect(short.destination);
  } catch (error) {
    console.error("Failed to handle redirect:", error);
    return res.sendStatus(500);
  }
}

export async function createCustomUrl(req, res) {
  const { destination, custom } = req.body;
  try {
    const linkExists = await shortUrl.findOne({ shortId: custom });

    if (linkExists) {
      throw new Error(`${custom} already in use`);
    }

    const newCustomUrl = await shortUrl.create({
      destination: destination,
      shortId: custom,
      visitHistory: [],
    });

    return res.send(newCustomUrl.toObject());
  } catch (error) {
    console.error("Failed to create custom link:", error);
    return res.sendStatus(500);
  }
}

export async function getAnalytics(req, res) {
  try {
    const analyticsData = await analytics.find().populate("shortUrl").lean();

    let totalClicks = 0;
    const visitHistory = [];

    for (const data of analyticsData) {
      if (
        data.shortUrl &&
        data.shortUrl.visitHistory &&
        Array.isArray(data.shortUrl.visitHistory)
      ) {
        totalClicks += data.shortUrl.visitHistory.length;
        visitHistory.push(...data.shortUrl.visitHistory);
      }
    }

    return res.json({
      totalClicks,
      ana: visitHistory,
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return res.sendStatus(500);
  }
}
