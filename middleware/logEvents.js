const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const logEvents = async (message, filename) => {
    const dateTime = `${format(new Date(), 'dd/MM/yyy\thh:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromise.mkdir(path.join(__dirname, '..', 'logs'));
        } else {
            await fsPromise.appendFile(path.join(__dirname, '..', 'logs', filename), logItem)
        }
    } catch (err) {
        console.error(err)
    }
}

const logger = (req, res, next) => {
    console.log(`${req.path} ${req.method}`);
    logEvents(`${req.url}\t${req.method}\t${req.headers.origin}`,'logEvents.txt')
    next();
}

module.exports = { logEvents, logger };