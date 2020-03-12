const dbSettings = {
    db: process.env.DB_NAME,
    server: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}

const serverSettings = {
    port: process.env.SERVER_PORT || 4000,
}

const kafkaSettings = {
    server:  process.env.KAFKA_HOST + ':' + process.env.KAFKA_PORT,
  };


const ipfsSettings = {
    host:  process.env.IPFS_HOST,
    port:  process.env.IPFS_PORT,
    httpPort: process.env.IPFS_HTTP_PORT
  };


//settings blockchain API
const privateBcServiceSettings = {
    rpcHost: process.env.PRIVATE_BC_HOST,
    rpcPort: process.env.PRIVATE_BC_PORT,
}

const mediaURL = process.env.MEDIA_URL
module.exports = Object.assign({}, { dbSettings, serverSettings, privateBcServiceSettings,kafkaSettings,ipfsSettings,mediaURL})
