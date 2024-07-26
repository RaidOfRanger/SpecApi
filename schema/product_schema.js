const mongoose = require('mongoose')
const Schema = mongoose.Schema

const product_schema = new Schema({
    
    
    title: {
        type: String,
        require: true
    },
    description: {
        type: String ,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    discountPercentage: {
        type: Number,
        require: true
    },
    rating: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    brand: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    thumbnail: {
        type: String ,
        require: true
    },
    images: {
        type: Array,
        require: false
    },
    owner:{
        type:String,
        require:true,
    }
})

const products = mongoose.model('products', product_schema)
module.exports = products

