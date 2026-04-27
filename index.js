const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')

const { connectToMongoDB } = require('./connect.js');
const URL = require('./models/url.js');

const urlRoutes = require('./routers/url.js');
const staticRoute = require('./routers/staticRouter.js')
const userRoute = require('./routers/user.js');

const { restrictToLoginUserOnly, checkAuth } = require('./middleware/auth.js');

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch((err) => console.log('Connection Error', err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/url', restrictToLoginUserOnly, urlRoutes);
app.use('/user', userRoute);
app.use('/',checkAuth , staticRoute);


app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            }
        }
    })
    if (!entry) {
        return res.status(404).send('Short URL not found');
    }
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log('Server Started at PORT :', PORT));