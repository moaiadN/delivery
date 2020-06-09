const express = require("express")
const router = express.Router()
const Order = require('../models/Order')
const { check, validationResult} = require('express-validator/check')
const moment = require('moment');
moment().format();
// middleware to check if user is logged in
isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/users/login')
}
//create new order
router.get('/create', isAuthenticated, (req, res) => {
    res.render('order/create', {
        errors: req.flash('errors')
    })
})
// route to home orders
router.get('/:pageNo?', (req, res) => {
    let pageNo = 1
    if (req.params.pageNo) {
        pageNo = parseInt(req.params.pageNo)
    }
    if (req.params.pageNo == 0) {
        pageNo = 1
    }
    let q = {
        skip: 5 * (pageNo - 1),
        limit: 5
    }
    //find total documents
    let totalDocs = 0
    Order.countDocuments({}, (err, total) => {}).then((response) => {
        totalDocs = parseInt(response)
        Order.find({}, {}, q, (err, orders) => {
            //     res.json(order)
            let chunk = []
            let chunkSize = 3
            for (let i = 0; i < orders.length; i += chunkSize) {
                chunk.push(orders.slice(i, chunkSize + i))
            }
            //res.json(chunk)
            res.render('order/index', {
                chunk: chunk,
                message: req.flash('info'),
                total: parseInt(totalDocs),
                pageNo: pageNo
            })
        })
    })
})
// save Order to db
router.post('/create', [
    check('orderBox').isLength({min: 5 }).withMessage('Order should be more than 5 char'),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array())
        res.redirect('/orders/create')
    } else {
        let newOrder = new Order({
            orderBox: req.body.orderBox,
            user_id: req.user.id,
            created_at: Date.now()
        })
        newOrder.save((err) => {
            if (!err) {
                console.log('Order was added')
                req.flash('info', ' The Order was created successfully')
                res.redirect('/orders')
            } else {
                console.log(err)
            }
        })
    }
})
// show single Order
router.get('/show/:id', (req, res) => {
    Order.findOne({
        _id: req.params.id
    }, (err, order) => {
        if (!err) {
            res.render('order/show', {
                order: order
            })
        } else {
            console.log(err)
        }
    })
})
// edit route
router.get('/edit/:id', isAuthenticated, (req, res) => {
    Order.findOne({
        _id: req.params.id
    }, (err, order) => {
        if (!err) {
            res.render('order/edit', {
                order: order,
                errors: req.flash('errors'),
                message: req.flash('info')
            })
        } else {
            console.log(err)
        }
    })
})
// update the form
router.post('/update', [
    check('orderBox').isLength({min: 5 }).withMessage('Order should be more than 5 char'),
], isAuthenticated, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array())
        res.redirect('/order/edit/' + req.body.id)
    } else {
        // create obj
        let newfields = { orderBox: req.body.orderBox, }

        let query = { _id: req.body.id }

        Order.updateOne(query, newfields, (err) => {
            if (!err) {
                req.flash('info', " The order was updated successfully"),
                    res.redirect('/orders')
            } else {
                console.log(err)
            }
        })
    }
})
//delete order
router.delete('/delete/:id', isAuthenticated, (req, res) => {
    let query = { _id: req.params.id }

    Order.deleteOne(query, (err) => {
        if (!err) {
            res.status(200).json('deleted')
        } else {
            res.status(404).json('There was an error .order was not deleted')
        }
    })
})
module.exports = router