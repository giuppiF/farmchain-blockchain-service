const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const bodyParser = require('body-parser');


const start  = (options) => {
    return new Promise((resolve,reject) =>{
        if(!options.repo){
            reject(new Error('Il repository non è connesso'))
        }
        if(!options.port){
            reject(new Error('Non è disponibile nessuna porta'))
        }

        const app = express()

        // morgan gestisce il logging sul web server (formati dev, short ... )
        app.use(morgan('dev'))

        // helmet aggiunge header di sicurezza
        app.use(helmet())
        app.use(bodyParser.json()); 
        app.use((err,req,res,next) => {
            reject(new Error('Something went wrong!, err:' + err))
            res.status(500).send('Something went wrong!')
        })

        const blockchainApi = require('../api/blockchain')(options)
        app.use('/blockchain/',blockchainApi) 


        const server = app.listen(options.port, () => resolve(server))
    })
}


module.exports = Object.assign({},{start});