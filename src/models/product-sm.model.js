const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');

var joiMediaSchema = Joi.object().keys({
    filename: Joi.string(),
    timestamp: Joi.string(),
    longitude: Joi.date(),
    latitude: Joi.string(),
    smartContract: Joi.string()
})

var joiProductSmartContractSchema = Joi.object({
    name: Joi.string().required(),
    smartContract: Joi.string().required(),
    medias: Joi.array().items(joiMediaSchema),
})

var mongooseProductSmartContractSchema = new Mongoose.Schema(Joigoose.convert(joiProductSmartContractSchema));

module.exports = Mongoose.model('ProductSmartContract', mongooseProductSmartContractSchema); 