const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const products = require('../schema/product_schema')
const register_user = require('../schema/register_user')

const secretkey = "checkup"

router.get('/fetch_product', (req, res, next) => {

    // const token = req.cookies.jwt
    // const check_jwt = jwt.verify(token,secretkey)
    // console.log(check_jwt)

    // if(!check_jwt){
    //     res.status(401).send({
    //         message:"session over"
    //     })
    // }

    console.log('data in');
    products.find({}).then((result) => {
        console.log('result',result);
        res.send(result);
    }).catch(err => console.log('err',err))

})

//add product data to db

router.post('/add_product',(req, res, next) => {
    console.log("requested body", req.body)
    const addproducts = new products(req.body)
    addproducts.save()
        .then(result => {
            res.send(result)
            console.log("saved")
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/register', async (req, res, next) => {
    const logindata = new register_user(req.body)
    console.log(logindata)
    //generating crypted paasword
    const salt = await bcrypt.genSalt(10)
    const hashpass = await bcrypt.hash(logindata.password, salt)
    logindata.password = hashpass
    //checking in db if email id is already registered
    const record = await register_user.findOne({ email: logindata.email })
    // if already exist
    if (record) {
        return res.status(401).send({
            message: "Email is already exist"
        })
    } else {//else send data
        const token = jwt.sign({ logindata }, secretkey)
        //sending data to db and in response sending jwt token back to frontend to save it to local storage of chrome
        logindata.save()
            .then((result) => {
                // sending cookie back to browser
                res.cookie("jwt", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                console.log("saved")
                res.send({
                    message: "success"
                })

            })
            .catch(err => {
                console.log("error", err)

            })
    }
})

router.post('/login',async (req, res, next) =>{
    const login = new register_user(req.body)
    register_user.findOne({email: login.email}).then(async (result) => {
        console.log("result",result.password)
        
        await bcrypt.compare(login.password,result.password).then(result => {
           if(result){
            res.send("user logged in")
           }
        }).catch(err => {
            console.log(err)
            res.send(err)
        })
    })
})


module.exports = router