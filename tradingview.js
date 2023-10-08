export const processPairIndicators = async (page, asset, exchange) => {
    let image;
    await page.goto('https://www.tradingview.com/symbols/'+asset+'USDT/technicals');

    try {
        // Search and select an asset
        await page.waitForSelector('.speedometersContainer-kg4MJrFB');
        await page.waitForSelector('#id_technicals-intervals-tabs_tablist');
        await page.click('#\\34 h');
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec

        const indicatorsContainer = await page.$('.speedometersContainer-kg4MJrFB');

        // Capture a screenshot and save it as a JPG file
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec
        if (process.env.MODE === 'prod') {
            image = await indicatorsContainer.screenshot({ type: 'jpeg', quality: 100, omitBackground: true });
        } else {
            image = await indicatorsContainer.screenshot({ path: `./screenshots/${exchange.toLowerCase()}-indicators.jpeg`, type: 'jpeg', quality: 100, omitBackground: true });
        }
    } catch (e) {
        console.log('An exception occured during drawing analysing chart for asset ', asset, e);
        return null;
    }

    return image;
};