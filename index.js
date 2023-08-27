import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { sendEmail } from "./mailSender.js";

const isScheduled = true;
const REPORT_INTERVAL = 30000;

const fetchReportContent = () => {
    var myHeaders = new Headers();
    myHeaders.append("x-xsrf-token", "1692273107|D5fArTJAZGQA");
    myHeaders.append("authorization", "wixcode-pub.0575b1d1caf7b7cd22b366ff0fd5473f06354ce3.eyJpbnN0YW5jZUlkIjoiNzczOWY5ZDUtZTc0Yi00ZTMzLWJlYjYtMjZkMzNhNzgwZGUyIiwiaHRtbFNpdGVJZCI6Ijc3ZjNkZDc0LTA1YWQtNDAwMy04ZjE2LTYyNzI0MjY2OWM4YSIsInVpZCI6IjNmOTAyN2NjLTI5NDUtNDk3ZC1iYWI2LTM5MGUxNDAzMzcxYyIsInBlcm1pc3Npb25zIjpudWxsLCJpc1RlbXBsYXRlIjpmYWxzZSwic2lnbkRhdGUiOjE2OTIzMzMwOTYyNDMsImFpZCI6IjM5YmRlNzAwLWIyZDQtNDRjNy1hMTE2LWRhODgwNThkOWJhZiIsImFwcERlZklkIjoiQ2xvdWRTaXRlRXh0ZW5zaW9uIiwiaXNBZG1pbiI6ZmFsc2UsIm1ldGFTaXRlSWQiOiI3YTBjMzUzMS1mNzFkLTRmYjAtYjI2NS00ZWUwOTZmM2Y1ZmUiLCJjYWNoZSI6bnVsbCwiZXhwaXJhdGlvbkRhdGUiOiIyMDIzLTA4LTE4VDA4OjMxOjM2LjI0M1oiLCJwcmVtaXVtQXNzZXRzIjoiQWRzRnJlZSxIYXNEb21haW4sU2hvd1dpeFdoaWxlTG9hZGluZyIsInRlbmFudCI6bnVsbCwic2l0ZU93bmVySWQiOiI4NTRmNTgxNC1lN2E2LTRlZGUtOGEyNS0xMTZjNTNlMmIyYmQiLCJpbnN0YW5jZVR5cGUiOiJwdWIiLCJzaXRlTWVtYmVySWQiOiIzZjkwMjdjYy0yOTQ1LTQ5N2QtYmFiNi0zOTBlMTQwMzM3MWMiLCJwZXJtaXNzaW9uU2NvcGUiOm51bGwsImxvZ2luQWNjb3VudElkIjpudWxsfQ==");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json, text/plain, */*");
    myHeaders.append("x-wix-app-instance", "wixcode-pub.0575b1d1caf7b7cd22b366ff0fd5473f06354ce3.eyJpbnN0YW5jZUlkIjoiNzczOWY5ZDUtZTc0Yi00ZTMzLWJlYjYtMjZkMzNhNzgwZGUyIiwiaHRtbFNpdGVJZCI6Ijc3ZjNkZDc0LTA1YWQtNDAwMy04ZjE2LTYyNzI0MjY2OWM4YSIsInVpZCI6IjNmOTAyN2NjLTI5NDUtNDk3ZC1iYWI2LTM5MGUxNDAzMzcxYyIsInBlcm1pc3Npb25zIjpudWxsLCJpc1RlbXBsYXRlIjpmYWxzZSwic2lnbkRhdGUiOjE2OTIzMzMwOTYyNDMsImFpZCI6IjM5YmRlNzAwLWIyZDQtNDRjNy1hMTE2LWRhODgwNThkOWJhZiIsImFwcERlZklkIjoiQ2xvdWRTaXRlRXh0ZW5zaW9uIiwiaXNBZG1pbiI6ZmFsc2UsIm1ldGFTaXRlSWQiOiI3YTBjMzUzMS1mNzFkLTRmYjAtYjI2NS00ZWUwOTZmM2Y1ZmUiLCJjYWNoZSI6bnVsbCwiZXhwaXJhdGlvbkRhdGUiOiIyMDIzLTA4LTE4VDA4OjMxOjM2LjI0M1oiLCJwcmVtaXVtQXNzZXRzIjoiQWRzRnJlZSxIYXNEb21haW4sU2hvd1dpeFdoaWxlTG9hZGluZyIsInRlbmFudCI6bnVsbCwic2l0ZU93bmVySWQiOiI4NTRmNTgxNC1lN2E2LTRlZGUtOGEyNS0xMTZjNTNlMmIyYmQiLCJpbnN0YW5jZVR5cGUiOiJwdWIiLCJzaXRlTWVtYmVySWQiOiIzZjkwMjdjYy0yOTQ1LTQ5N2QtYmFiNi0zOTBlMTQwMzM3MWMiLCJwZXJtaXNzaW9uU2NvcGUiOm51bGwsImxvZ2luQWNjb3VudElkIjpudWxsfQ==");
    myHeaders.append("Referer", "https://www.altsdaddy.com/_partials/wix-thunderbolt/dist/clientWorker.4afff495.bundle.min.js");
    myHeaders.append("x-wix-site-revision", "3395");
    myHeaders.append("commonconfig", "%7B%22brand%22%3A%22wix%22%2C%22host%22%3A%22VIEWER%22%2C%22bsi%22%3A%2205c78765-2ddb-41e1-b122-b86939593eb6%7C1%22%2C%22BSI%22%3A%2205c78765-2ddb-41e1-b122-b86939593eb6%7C1%22%7D");
    myHeaders.append("Cookie", "XSRF-TOKEN=1692274016|9KqchoktjI46");

    var raw = JSON.stringify([]);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    // Process function
    const processData = json => {
        (async () => {

            let content = '';
            let attachments = [];
            for (const key of Object.keys(json.result)) {
                const obj = json.result[key];
                console.log(`\n#${obj.Exchange}\n`);
                content += `------------------------------\n#${obj.Exchange}\n`;

                console.log(`⬆️ Price Increase 1h`);
                content += `⬆️ Price Increase 1h\n`;

                for (const [index, p] of obj.Pumps.entries()) {
                    if (index === 0) {
                        const content = await generateAnalysisImage(p[0], obj.Exchange)
                        attachments.push({
                            filename: `${p[0]}-${obj.Exchange}.png`,
                            content: content,
                        });
                    }
                    console.log(`$${p[0]} ▴${p[1]}%`);
                    content += `$${p[0]} ▴${p[1]}%\n`;
                };


                console.log(`\n⬆️ Volume Increase 1h`);
                content += `\n⬆️ Volume Increase 1h\n`;
                obj.Activity.forEach(p => {
                    console.log(`$${p[0]} ▴${p[1]}%`);
                    content += `$${p[0]} ▴${p[1]}%\n`;
                });
            };

            console.log('atttachments', attachments);
            sendEmail(content, attachments);
        })();
    }

    fetch("https://www.altsdaddy.com/_api/wix-code-public-dispatcher-ng/siteview/_webMethods/backend/test.jsw/httpgetHome.ajax?gridAppId=350ba791-436b-4ad2-9918-55dc92c9b438&instance=wixcode-pub.0575b1d1caf7b7cd22b366ff0fd5473f06354ce3.eyJpbnN0YW5jZUlkIjoiNzczOWY5ZDUtZTc0Yi00ZTMzLWJlYjYtMjZkMzNhNzgwZGUyIiwiaHRtbFNpdGVJZCI6Ijc3ZjNkZDc0LTA1YWQtNDAwMy04ZjE2LTYyNzI0MjY2OWM4YSIsInVpZCI6IjNmOTAyN2NjLTI5NDUtNDk3ZC1iYWI2LTM5MGUxNDAzMzcxYyIsInBlcm1pc3Npb25zIjpudWxsLCJpc1RlbXBsYXRlIjpmYWxzZSwic2lnbkRhdGUiOjE2OTIzMzMwOTYyNDMsImFpZCI6IjM5YmRlNzAwLWIyZDQtNDRjNy1hMTE2LWRhODgwNThkOWJhZiIsImFwcERlZklkIjoiQ2xvdWRTaXRlRXh0ZW5zaW9uIiwiaXNBZG1pbiI6ZmFsc2UsIm1ldGFTaXRlSWQiOiI3YTBjMzUzMS1mNzFkLTRmYjAtYjI2NS00ZWUwOTZmM2Y1ZmUiLCJjYWNoZSI6bnVsbCwiZXhwaXJhdGlvbkRhdGUiOiIyMDIzLTA4LTE4VDA4OjMxOjM2LjI0M1oiLCJwcmVtaXVtQXNzZXRzIjoiQWRzRnJlZSxIYXNEb21haW4sU2hvd1dpeFdoaWxlTG9hZGluZyIsInRlbmFudCI6bnVsbCwic2l0ZU93bmVySWQiOiI4NTRmNTgxNC1lN2E2LTRlZGUtOGEyNS0xMTZjNTNlMmIyYmQiLCJpbnN0YW5jZVR5cGUiOiJwdWIiLCJzaXRlTWVtYmVySWQiOiIzZjkwMjdjYy0yOTQ1LTQ5N2QtYmFiNi0zOTBlMTQwMzM3MWMiLCJwZXJtaXNzaW9uU2NvcGUiOm51bGwsImxvZ2luQWNjb3VudElkIjpudWxsfQ==&viewMode=site", requestOptions)
        .then(response => response.json())
        .then(result => processData(result))
        .catch(error => console.log('error', error));


}

const checkAndExecute = () => {
    const now = new Date();
    const currentMinutes = now.getMinutes();

    if (currentMinutes % 5 === 0) {
        // Execute your code here
        console.log("Code executed because current minutes are 59.");
        fetchReportContent();
    } else {
        console.log("Current minutes:", currentMinutes);
    }
}


const generateAnalysisImage = async (asset, exchange) => {
    if (exchange === 'Gateio') {
        exchange = 'Gate';
    }

    return new Promise((resolve, reject) => {
        fetch("https://dyor.net/js/quickview.php", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-GB,en;q=0.8",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Brave\";v=\"115\", \"Chromium\";v=\"115\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://dyor.net/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "cointoload=" + asset + "-USDT-" + exchange + "&action=load",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(response => response.text())
            .then(htmlText => {
                const $ = cheerio.load(htmlText);
                let isOneHourAnalysis = true;

                let element = $('[id="' + asset + 'USDT1h-analysis"]');

                if (element.length === 0) {
                    element = $('[id="' + asset + 'USDT4h-analysis"]');
                    isOneHourAnalysis = false;
                }

                if (element.length > 0) {

                    (async () => {

                        const content = element.html();
                        const browser = await puppeteer.launch();
                        const page = await browser.newPage();

                        // Set the HTML content
                        const htmlContent = `<html>
                        <head>
                        <link rel="stylesheet"
                              href="https://fonts.googleapis.com/css?family=Josefin%20Sans">
                              <style>
                              body {
                                font-family: 'Josefin Sans';
                                background: #16202c;
                                height: fit-content;
                              }
                              
                              .content {
                                background: linear-gradient(0deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.065) 100%);
                                padding: 20px;
                              }
                              
                              .bearish {
                                color: #f5505f;
                              }
                              
                              .bearish-indicators li {
                                color: #f5505f;
                              }
                              
                              .bullish {
                                color: #23d2b9;
                              }
                              
                              .bullish-indicators li {
                                color: #23d2b9;
                              }

                              .title {
                                color: #23d2b9;
                              }
                              </style>
                              </head>
                              <body><div class="content"><p class="title">${asset}/USDT - ${isOneHourAnalysis ? '1h' : '4h'} Analysis</p>${content}</div></body></html>`;
                        await page.setContent(htmlContent, { waitUntil: 'networkidle2' });

                        // Capture a screenshot and save it as a JPG file
                        // await page.screenshot({ path: 'screenshot.jpg', type: 'jpeg', quality: 100 });

                        const contentElement = await page.$('.content');        // declare a variable with an ElementHandle
                        const resultImage = await contentElement.screenshot({ type: 'jpeg', quality: 100, omitBackground: true });

                        await browser.close();

                        resolve(resultImage)
                    })();
                } else {
                    console.log("Element not found");
                    resolve(null);
                }
            });
    })
}

const main = () => {
    if (isScheduled) {
        setInterval(() => {
            checkAndExecute();
        }, REPORT_INTERVAL);
    } else {
        fetchReportContent();

    }
}

main();