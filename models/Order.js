const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    
    orderBox: {
        type: String,
        required: true
    },
    user_id : {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
})

let Order = mongoose.model('Order', orderSchema, 'orders')

module.exports = Order