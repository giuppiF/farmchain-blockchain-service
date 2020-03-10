const blockchainService = require('./blockchain.service')
const kafkaService = require('./kafka.service')
module.exports = Object.assign({}, {blockchainService,kafkaService})
