import puppeteer from 'puppeteer'
import logger from './logger.js'
import { clickInput, findTimeframeTargetBox } from './utils.js'

export const drawChart = async (exchangeAssetMap) => {
    // init setup
    let browser;

    if (process.env.MODE === 'prod') {
         browser = await puppeteer.launch({ headless: 'new' })
    } else {
        browser = await puppeteer.launch({ headless: false, args: ['--start-fullscreen'] })
    }
    
    const url = 'https://dyor.net/#dashboard'
    const page = await browser.newPage()
    
    // Configure the navigation timeout
    await page.setDefaultNavigationTimeout(0);

    await page.setViewport({ width: 1366, height: 768 })
    await page.goto(url)

    // login
    await login(page)

    // collect analytic images
    const images = []
    for await (const [exchange, asset] of Object.entries(exchangeAssetMap)) {
        images.push({
            filename: `${asset}-${exchange}.jpeg`,
            content: await processPair(page, asset, exchange)
        })
    }

    browser.close()

    return images
}

const processPair = async (page, asset, exchange) => {
    let image

    try {
        if (exchange === 'Kucoin') {
            exchange = 'KuCoin'
        }

        if (exchange === 'Mexc') {
            return
        }

        if (exchange === 'Gateio') {
            exchange = 'Gate'
        }

        // Search and select an asset
        await page.waitForSelector('#quickviewform-searchcoin')
        await page.type('#quickviewform-searchcoin', asset)
        await page.waitForSelector(`[data-value="${asset}-USDT-${exchange}"]`)
        await page.click(`[data-value="${asset}-USDT-${exchange}"]`)

        // waits for page load
        await new Promise(resolve => setTimeout(resolve, 2000)) // 2 sec
        await page.waitForSelector(`.exchange-${exchange.toLowerCase()}`)

        // Click 4h frame
        const selector = await findTimeframeTargetBox(page, process.env.DYOR_CHART_TIMEFRAME, asset, exchange)
        await page.click(selector)

        // Wait for the chart to load
        await page.waitForSelector('#the-chart')

        // Click MACD selector
        await page.waitForSelector('.macd')
        await page.click('.macd')

        // set indicators
        const indicators = process.env.DYOR_INDICATORS.split(', ')
        for await (const indicator of indicators) {
            await clickInput(page, indicator)
        }

        // move the cursor away
        await page.mouse.move(1, 1)

        // Capture a screenshot and save it as a JPG file
        await new Promise(resolve => setTimeout(resolve, 1000)) // 1 sec
        if (process.env.MODE === 'prod') {
            image = await page.screenshot({ type: 'jpeg', quality: 100, omitBackground: true })
        } else {
            image = await page.screenshot({ path: `./screenshots/${exchange.toLowerCase()}.jpeg`, type: 'jpeg', quality: 100, omitBackground: true })
        }

        // Hide the chart and proceed to next asset if present
        await page.waitForSelector('a.hide-chart', { timeout: 5000 })
        await page.click('a.hide-chart')
    } catch (e) {
        const text = 
        console.log('An exception occured during drawing analysing chart for asset ', asset, e)
        logger.error('An exception occured during drawing analysing chart for asset ', asset, e);
        return null
    }

    return image
}

const login = async (page) => {
    // click login
    await page.click('body > div.dyor-main > div.dyor-content.scroll > div.dyor-header > div.dyor-home-menu > ul > li:nth-child(4) > a')

    // set email and pass
    await page.waitForSelector('#user-email')
    await page.type('#user-email', process.env.DYOR_USER)
    await page.type('#user-password', process.env.DYOR_PASS)

    // click submit
    await page.click('body > div.dyor-popin.dyor-standard-popin > div > div > div.signin-tab.tab.active > form > input[type=submit]')

    // wait for premium modal
    await page.waitForSelector('#premium-soon')
    // click close
    await page.click('.close-popin')
}
