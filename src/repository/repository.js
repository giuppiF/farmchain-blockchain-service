'use strict'
const ProductSmartContract = require('../models/product-sm.model')


const repository = () => {
    
  const getProductSmartContract = async (id) =>
  {
    try {
      let productSM = await ProductSmartContract.findById(id)
      return productSM
    } catch (error){
      throw Error(error);
    }
  }

  const createProductSmartContract = async (payload) => {
    try{
      let productSM = await new ProductSmartContract(payload)
      await productSM.save()   
      return productSM
    } catch (error) {
      throw Error(error)
    }
  }

  
 
  return Object.create({
    getProductSmartContract,
    createProductSmartContract
  })
}

const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection db not supplied!'))
    }
    
    resolve(repository(connection))
  })
}

module.exports = Object.assign({}, {connect})
