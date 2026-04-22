const express = require('express');
const URL = require ('../models/url.js')
const router = express.Router();

router.get('/', async(req, resp) => {
    const allUrls = await URL.find({});
    return resp.render('home',{
        urls : allUrls
    }
    )
})

module.exports = router