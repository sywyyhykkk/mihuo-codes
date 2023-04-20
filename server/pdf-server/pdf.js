import fetch from 'node-fetch'
import puppeteer from 'puppeteer'
import { FormData, File } from 'formdata-node'

export default async function getPdfDownloadUrl(htmlString, authorization, fileName, apiBase) {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
            timeout: 0 // 不设置超时时间
            // https://stackoverflow.com/questions/66177036/firebase-puppeteer-pdf-function-times-out-due-to-chrome-revision
        })
        const page = await browser.newPage()
        await page.setContent(htmlString, { waitUntil: 'networkidle2' })
        await page.content()
        await page.emulateMediaType('screen')
        // wait until .main-container is visible
        await page.waitForSelector('.main-container', {
            visible: true,
            timeout: 0 // 不设置超时时间
        })
        const pdf = await page.pdf({
            path: '', // 不保存到本地
            margin: { top: '0px', right: '50px', bottom: '0px', left: '50px' },
            printBackground: true,
            format: 'A4',
        })
        if (pdf) {
            let url = apiBase + 'admin/sys-file/upload'
            console.log('------------上传文件接口------------', url)
            const formData = new FormData()
            const file = new File([pdf], fileName + '.pdf')
            formData.set('file', file)
            let status = 200
            fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: authorization,
                },
                body: formData,
            }).then((response) => {
                status = response.status
                return response.json()
            }).then(async data => {
                await page.close()
                await browser.close()
                if (data.code === 0) {
                    console.log('------------上传文件成功------------', data)
                    resolve({
                        status: status,
                        data
                    })
                } else {
                    reject({
                        status: status,
                        data
                    })
                }
            })
        } else {
            await page.close()
            await browser.close()
            reject({
                code: 1,
                msg: '生成pdf失败',
                data: null
            })
        }
    }).catch(error => {
        throw error
    })
}
