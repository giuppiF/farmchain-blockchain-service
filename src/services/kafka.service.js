var kafka = require('kafka-node');
const ipfsCluster = require('ipfs-cluster-api')
const hasha = require('hasha');
const fetch = require('node-fetch');
const Web3 = require('web3');

const { getBytes32FromMultiash, getMultihashFromContractResponse } = require('./multihash')

const createMedia = async (options,media,producer) => {
  try{
    const {repo,privateBcServiceSettings,ipfsSettings,mediaURL} = options
    
    const cluster = ipfsCluster(ipfsSettings.host, ipfsSettings.port, { protocol: 'http' })
    const mediaFile = await fetch(mediaURL +media.src);
    const buffer = await mediaFile.buffer();
    const hash = await hasha.async(buffer, {algorithm: 'md5'})
    media.hash = hash
    
    const doc = JSON.stringify(media);
    const obj = {
      path: 'media',
      content: Buffer.from(doc),
      name: media._id
    }
   
    var ipfsResponse = await cluster.add(obj)


    const bcURL = 'http://'+privateBcServiceSettings.rpcHost + ':' + privateBcServiceSettings.rpcPort
    const web3 = new Web3(bcURL);
    const {abi, bytecode } = require('../abis/IPFSStorage');

    let accounts, contract;

    async function createContract() {
        const { digest, hashFunction, size } = getBytes32FromMultiash(ipfsResponse[0].hash.toString());
   //     accounts = await web3.eth.getAccounts();
        account = "0x004dd483c20d1b99c50aa67926fddf787e6e0e63"

        contract = await new web3.eth.Contract(abi)
            .deploy({
                data: bytecode,
                arguments: [digest, hashFunction, size]
            })
            .send({ from: account, gas: 2000000  });
        return contract
    }
    var hashContract = await createContract()
   
    
    //var ciao = await hashContract.methods.getEntry(account).call();
    media.smartContract = hashContract.options.address
    let payloads = [
      {
        topic: "service.blockchain",
        messages: JSON.stringify({event: "create.blockchain", data: media})
      }
    ];
    let push_status = producer.send(payloads, (err, data) => {
      if (err) {
        throw Error(err)
      } else {
        console.log("pubblicato evento create.blockchain in topic service.blockchain with data : " + media )
        return;
      }
    });


  } catch (err) {
    throw Error(err)
  }
}


const kafkaService = (options, producer,client) => {
  
  try {
    const Consumer = kafka.Consumer;
    var kafkaOptions = [{ topic: 'service.product', partition: 0 }]
    var kafkaConsumerOptions =  {
      autoCommit: true,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      encoding: 'utf8',
      fromOffset: false
    };
  
  let consumer = new Consumer(
    client,
    kafkaOptions,
    kafkaConsumerOptions
    );

    var mediaFunctions = {
      "create.media" : (repo,media) => {
        return createMedia(repo, media, producer)
      }


    }
    consumer.on('message', async function(message) {

      var message_parsed = JSON.parse(message.value);
      mediaFunctions[message_parsed.event](options,message_parsed.data)

    })
    consumer.on('error', function(err) {
        console.log('error', err);
    });
    }
    catch(e) { 
      throw Error(e)
    }

  const publishEvent = async (topic,event,data) =>  {

    let payloads = [
      {
        topic: topic,
        messages: JSON.stringify({event: event, data: data})
      }
    ];
    let push_status = producer.send(payloads, (err, data) => {
      if (err) {
        throw Error(err)
      } else {
        return;
      }
    });
  }
  return Object.create({
    publishEvent
  })
}


const start = (options) => {
  return new Promise((resolve, reject) => {

    if (!options) {
      reject(new Error('options settings not supplied!'))
    }
    const Producer = kafka.Producer;

    const client = new kafka.KafkaClient({kafkaHost: options.kafkaSettings.server});

    const producer = new Producer(client);

    producer.on('ready', async function() {
      resolve(kafkaService(options,producer,client))
    });
    producer.on('error', function(err) {
      reject(new Error('kafka connection error'))
    });
    
  })
}

module.exports = Object.assign({}, {start})