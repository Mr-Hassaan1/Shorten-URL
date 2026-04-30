
const { nanoid } = require('nanoid');
const URL = require('../models/url.js')

async function handleGenerateNewShortURL(req, resp) {
    const shortID = nanoid(8)
    const body = req.body
    if (!body.url) return resp.status(400).json({ err: 'url is required' })
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id
    });
    return resp.render('home', { id: shortID, user: req.user })
}

async function handleGetAnalytics(req, resp) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId, createdBy: req.user._id })
    
    if (!result) {
        return resp.status(404).json({ err: 'URL not found or access denied' })
    }
    
    return resp.json(
        {
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory
        }
    )

}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics
}
