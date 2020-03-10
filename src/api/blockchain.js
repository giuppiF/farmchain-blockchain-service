'use strict'
const status = require('http-status')
const router = require('express').Router();
const Web3 = require('web3');
const ipfsClient = require('ipfs-http-client')
const ipfsCluster = require('ipfs-cluster-api')
const { getBytes32FromMultiash, getMultihashFromContractResponse } = require('../services/multihash')

module.exports = (options) => {
    const {repo,privateBcServiceSettings} = options
    const ipfs = ipfsClient('http://ec2-34-244-163-38.eu-west-1.compute.amazonaws.com:9094/') 
    const cluster = ipfsCluster('ec2-34-244-163-38.eu-west-1.compute.amazonaws.com', '9094', { protocol: 'http' })


    router.get('/', async (req,res) => {
        res.status(status.OK)
    })


    router.post('/product', async (req,res) => {
        const productSMData = {
            name: req.body.name
        }

        //const bcURL = 'http://'+privateBcServiceSettings.rpcHost + ':' + privateBcServiceSettings.rpcPort
        const bcURL = 'http://ec2-34-244-163-38.eu-west-1.compute.amazonaws.com:8540'
        try{
            const web3 = new Web3(bcURL);
            const {abi, bytecode } = require('../../truffle/build/contracts/Test');
            console.log(web3.eth.gasPrice)
            let accounts, contract;
        
            async function createContract() {
                try{
                accounts = await web3.eth.getAccounts();
                contract = await new web3.eth.Contract(abi)
                    .deploy({
                        data: bytecode,
                        arguments: ['ciaoooo']
                    })
                    .send({ from: accounts[0], gas: 2000000  });
                console.log(contract)
            }catch(err){
                console.log(err)
            }
            }
            createContract().then(() => {res.status(200).json({"contract" : contract.options.address});});
          /*  createContract().then(
                 () => {
                    
                    productSMData.smartContract = contract.options.address
                    res.status(status.OK).json(productSMData)
                }
            );
            var productSM = await repo.createProductSmartContract(productSMData)
                    productSM ?
                        res.status(status.OK).json(productSM)
                    :
                        res.status(404).send()
*/
            
        } catch (err) {
            console.log(err.message)
        }
    })

    router.post('/smartcontract', async (req,res) => {
        try{
            const bcURL = 'http://'+privateBcServiceSettings.rpcHost + ':' + privateBcServiceSettings.rpcPort
            const web3 = new Web3(bcURL);
            const {abi, bytecode } = require('../../truffle/build/contracts/IPFSStorage');
        
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