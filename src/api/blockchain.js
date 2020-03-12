'use strict'
const status = require('http-status')
const router = require('express').Router();
const Web3 = require('web3');
const fetch = require('node-fetch')

const { getBytes32FromMultiash, getMultihashFromContractResponse } = require('../services/multihash')

module.exports = (options) => {
    const {repo,privateBcServiceSettings,ipfsSettings} = options

    router.get('/', async (req,res) => {
        res.status(status.OK).send("Service OK")
    })

    router.get('/smartcontract', async (req,res) => {
        try{
            const bcURL = 'http://'+privateBcServiceSettings.rpcHost + ':' + privateBcServiceSettings.rpcPort
            const web3 = new Web3(bcURL);
            const {abi, bytecode } = require('../abis/IPFSStorage');
        
            let accounts, contract;
            const smartContractAddress = req.query.address

            var account = "0x004dd483c20d1b99c50aa67926fddf787e6e0e63"
            async function getContract() {

           //     accounts = await web3.eth.getAccounts();
                account = "0x004dd483c20d1b99c50aa67926fddf787e6e0e63"
     
                var contract = new web3.eth.Contract(abi, smartContractAddress)

                
                return contract
            }
            var hashContract = await getContract()
           
            
            var ipfsHash = await hashContract.methods.getEntry(account).call();
            var ipfsRes = await fetch("http://" + ipfsSettings.host + ":" + ipfsSettings.httpPort + '/ipfs/' + getMultihashFromContractResponse(ipfsHash))
            var ipfsJsonRes = await ipfsRes.json()
            delete ipfsJsonRes.smartContract
            delete ipfsJsonRes.muted
            delete ipfsJsonRes.__v
            delete ipfsJsonRes.type
            delete ipfsJsonRes._id
            res.status(200).json(ipfsJsonRes)

        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })
    return router;
}