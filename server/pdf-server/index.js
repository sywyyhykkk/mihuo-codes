import express from 'express'
const app = express()
const port = 3001
import fetch from 'node-fetch'
import getPdfDownloadUrl from './pdf.js'

app.get('/reports', async (req, res) => {
    const { authorization } = req.headers
    const { type, id, urlEnv, log } = req.query
    let fileName = req.query.fileName
    console.log('-------------new request------------')
    console.log('------------authorization token------------', authorization)
    console.log('------------请求参数------------', req.query)
    if (!type || !id || !urlEnv) {
        return res.status(400).send({
            code: 1,
            msg: '参数不合法',
            data: false
        })
    }
    if (!authorization) {
        return res.status(424).send({
            code: 1,
            msg: 'token已过期',
            data: false
        })
    }
    const url = `http://localhost:3000/reports?type=${type}&id=${id}&urlEnv=${urlEnv}&log=${log}`
    const apiBase = urlEnv === '1' ?
        'http://dev.51mihuo.com:9999/' : urlEnv === '2' ?
            'https://api-test.51mihuo.com/' : urlEnv === '3' ?
                'https://api-uat.51mihuo.com/' : 'https://api.51mihuo.com/'
    fetch(url, {
        headers: {
            Authorization: authorization
        },
    }).then((response) => {
        return response.text()
    }).then(async data => {
        if (!fileName) {
            fileName = 'report'
        }
        const pdfResponse = await getPdfDownloadUrl(data, authorization, fileName, apiBase)
        if (!pdfResponse) {
            return res.status(500).send({
                code: 1,
                msg: null,
                data: false
            })
        }
        return res.status(pdfResponse.status).send(pdfResponse.data)
    }).catch(error => {
        return res.status(error.status || 500).send(error.data || {
            code: 1,
            msg: error.data || error,
            data: null
        })
    })
})

app.listen(port, () => {
    console.log(`服务启动, port => ${port}`)
})