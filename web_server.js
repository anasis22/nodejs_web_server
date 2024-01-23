const express = require('express');
const app = express();
const path = require('path');
const PORT = 3200;
const { logger } = require('./middleware/logEvents');
const { errorHandler } = require('./middleware/errorHandler')
const cors = require('cors');

// Middleware functions========
app.use(logger);
// Cross Origin Resource Sharing
const whitelist = ['https://anasismail.netlify.app/', 'https://www.google.com/'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not Allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/',express.static(path.join(__dirname, './public')))
app.use('/subdir',express.static(path.join(__dirname, './public')))
app.use('/',require('./routes/root'));
app.use('/subdir',require('./routes/subdir'));
// ============================
 
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" })
    } else {
        res.type('txt').send('404 Not Found');
    }
})

app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`))