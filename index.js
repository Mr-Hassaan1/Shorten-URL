const express = require('express');

const urlRoutes = require('./routers/url.js');
const { connectToMongoDB } = require('./connect.js');
const URL = require('./models/url.js')

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch((err) => console.log('Connection Error', err))

app.use(express.json());

app.use('/url', urlRoutes);
app.get('/:shortId', async (req, resp) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push : {
            visitHistory : {
                timestamp : Date.now()
            }
        }
    })
    resp.redirect(entry.redirectURL)
});

app.listen(PORT, () => console.log('Server Started at PORT :', PORT));