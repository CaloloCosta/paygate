document.getElementById('form').addEventListener('submit', async e => {
    e.preventDefault()
    let phone = e.target.elements[0].value
    let airtime = e.target.elements[1].value
    console.log("phone: "+phone+" airtime: "+airtime)
    const data = {
        phone,
        airtime
    }
    let result = await request('https://buy-airtime-proto.herokuapp.com/buy',data)
    redirect(result)

})

async function request(url,data){
    let response = await fetch(url,{
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return response.json()
}

async function redirect(data){
    // {PAYGATE_ID: "10011072130", PAY_REQUEST_ID: "A3A958FA-00A9-22EC-3001-74194F7B04D2", CHECKSUM: "c55c5bb3be41c2abff2357f7d6f2cb26", REFERENCE: "pgtest_123456789"}PAYGATE_ID: "10011072130"PAY_REQUEST_ID: "A3A958FA-00A9-22EC-3001-74194F7B04D2"CHECKSUM: "c55c5bb3be41c2abff2357f7d6f2cb26"REFERENCE: "pgtest_123456789"__proto__: Object
    let form = document.getElementById('redirect')
    form.elements[0].value = data.PAY_REQUEST_ID
    form.elements[1].value = data.CHECKSUM
    form.submit()

}

