import { logError } from "./utils.js";

export const processPairIndicators = async (page, asset, exchange) => {
    if (exchange === 'Kucoin') {
        exchange = 'KuCoin';
    }

    if (exchange === 'Mexc') {
        return;
    }

    if (exchange === 'Gateio') {
        exchange = 'Gate';
    }
    
    let image;
    await page.goto('https://www.tradingview.com/symbols/' + asset + 'USDT/technicals');

    try {
        // Search and select an asset
        await page.waitForSelector('.technicals-root');
        await page.click('#\\34 h');
        await page.addStyleTag({ content: '.subtitle-lu7Cy9jC {display: none;}' })
        await page.addStyleTag({ content: '.container-hvDpy38G {display: none;}' })
        await page.addStyleTag({ content: '.tablesWrapper-kg4MJrFB {display: none;}' })
        await page.addStyleTag({ content: '.variant-secondary-aHOVUrmQ {display: none;}' })
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec

        let indicatorsContainer = await page.$('.technicals-root');

        // Capture a screenshot and save it as a JPG file
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec
        if (process.env.MODE === 'prod') {
            image = await indicatorsContainer.screenshot({ type: 'jpeg', quality: 100, omitBackground: true });
        } else {
            image = await indicatorsContainer.screenshot({ path: `./screenshots/${exchange.toLowerCase()}-indicators.jpeg`, type: 'jpeg', quality: 100, omitBackground: true });
        }
    } catch (e) {
        console.log('An exception occured during drawing analysing chart for asset ', asset, e);
        logError(`An error ocurred while drawing tradingview analysing chart for asset ${asset}.Error: ${e}`);
        return null;
    }

    return image;
};
