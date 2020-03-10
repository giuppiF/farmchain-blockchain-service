const {dbSettings, serverSettings,privateBcServiceSettings,kafkaSettings,ipfsSettings,mediaURL} = require('./config')
const db = require('./mongo')
 
module.exports = Object.assign({}, {dbSettings, serverSettings, privateBcServiceSettings, db,kafkaSettings,ipfsSettings,mediaURL})