const axios = require('axios')
const c = require('crypto-js')
const path = require('path')
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname,'../public')))


app.get('/',(req,res) => {
    res.render('index')
})
app.post('/success',(req, res) => {
    res.sendFile(path.join(__dirname+'/../public/success.html'))
})

app.post('/buy', async (req, res) =>{

    console.log(req.body)
    const data = {
        PAYGATE_ID: 10011072130,
        REFERENCE: 'pgtest_123456789',
        AMOUNT: req.body.airtime,
        CURRENCY: 'NAD',
        RETURN_URL: 'http://localhost:3000/success',
        TRANSACTION_DATE: '2018-01-01 12:00:00',
        LOCALE: 'en',
        COUNTRY: 'NAM',
        EMAIL: 'customer@paygate.co.za',
    }
    
    function objectToString(obj){
        let str = ''
        for(let key in obj){
            str += obj[key]
        }
        return str
    }
    function http_build_query(obj){
        let str = ''
        for(let key in obj){
            str += key+"="+obj[key]+"&"
        }
        str = str.substring(0,str.length - 1)
        return str
    }
    
    let checksum = c.MD5(objectToString(data)+"secret").toString()
    
    data['CHECKSUM'] = checksum
    
    
    let response = await axios.post('https://secure.paygate.co.za/payweb3/initiate.trans',http_build_query(data))

    let arrayData = response.data.split('&')
    console.log(response.data)
    let resData = {
        PAYGATE_ID: arrayData[0].split('=')[1],
        PAY_REQUEST_ID: arrayData[1].split('=')[1],
        CHECKSUM: arrayData[3].split('=')[1],
        REFERENCE: arrayData[2].split('=')[1],
        
    }

    // let redrict = await axios.post('https://secure.paygate.co.za/payweb3/process.trans',http_build_query(resData))
    // console.log(redrict)
    res.send(resData)
    // res.redirect('https://secure.paygate.co.za/payweb3/process.trans')
    // console.log('https://secure.paygate.co.za/payweb3/process.trans?'+http_build_query(resData))

})

app.listen(port, () =>{
    console.log("app runing on port "+port)
})