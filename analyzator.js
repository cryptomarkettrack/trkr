import cheerio from 'cheerio';
import puppeteer from 'puppeteer';

export const generateAnalysisImage = async (asset, exchange) => {
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