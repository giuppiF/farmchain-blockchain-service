'use strict'
const status = require('http-status')
const router = require('express').Router();
const Web3 = require('web3');

const { getBytes32FromMultiash, getMultihashFromContractResponse } = require('../services/multihash')

module.exports = (options) => {
    const {repo,privateBcServiceSettings} = options

    router.get('/', async (req,res) => {
        res.status(status.OK).send("Service OK")
    })

    router.post('/smartcontract', async (req,res) => {
        try{
            const bcURL = 'http://'+privateBcServiceSettings.rpcHost + ':' + privateBcServiceSettings.rpcPort
            const web3 = new Web3(bcURL);
            const {abi, bytecode } = require('../abis/IPFSStorage');
        
            let accounts, contract;
            const smartContractAddress = req.body.smartContractAddress
            console.log(req.body)
            var account = "0x004dd483c20d1b99c50aa67926fddf787e6e0e63"
            async function getContract() {

           //     accounts = await web3.eth.getAccounts();
                account = "0x004dd483c20d1b99c50aa67926fddf787e6e0e63"
     
                var contract = new web3.eth.Contract(abi, smartContractAddress)

                
                return contract
            }
            var hashContract = await getContract()
           
            
            var ipfsHash = await hashContract.methods.getEntry(account).call();
            res.status(200).send({'ipfsHash': getMultihashFromContractResponse(ipfsHash)})

        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })
    return router;
}