
const { nanoid } = require('nanoid');
const URL = require('../models/url.js')

async function handleGenerateNewShortURL(req, resp) {
    const shortID = nanoid(8)
    const body = req.body
    if (!body.url) return resp.status(400).json({ err: 'url is required' })
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: []
    });
    return resp.render('home', { id: shortID })
}

async function handleGetAnalytics(req,resp) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId })
    return resp.json(
        {
            totalClicks : result.visitHistory.length,
            analytics : result.visitHistory
        }
    )

}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics
}
