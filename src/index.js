'use strict'
const {EventEmitter} = require('events')
const server = require('./server/server')
const repository = require('./repository/repository')
const config = require('./config')
const mediator = new EventEmitter()
const services = require('./services/')

mediator.on('db.ready', async (db) => {
    var repo = await repository.connect(db);

    var kafkaService = await services.kafkaService.start({
        kafkaSettings: config.kafkaSettings,
        repo: repo,
        privateBcServiceSettings: config.privateBcServiceSettings,
        ipfsSettings: config.ipfsSettings,
        mediaURL: config.mediaURL
    })

    var app = await server.start({
        port:  config.serverSettings.port,
        repo: repo,
        kafkaService: kafkaService,
        privateBcServiceSettings: config.privateBcServiceSettings
    }) 

    app.on('close', () => {
        repo.disconnect()
    })
})

mediator.on('db.error', () => {
    console.error('Errore nello start del db')
  })


config.db.connect(config.dbSettings, mediator)


mediator.emit('boot.ready');