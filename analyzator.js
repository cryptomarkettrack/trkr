import puppeteer from 'puppeteer';
import { clickInput } from './utils.js';

export const drawChart = async (assetOnExchanges) => {
    //init setup
    const browser = await puppeteer.launch({headless: false, args: ['--start-fullscreen']});
    const url = 'https://dyor.net/#dashboard';
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    await page.goto(url);
    
    //login
    await login(page);

    //collect analytic images
    let images = [];
    for await (const [asset, exchange] of Object.entries(assetOnExchanges)) {
      images.push({
        filename: `${asset}-${exchange}.jpeg`,
        content: await processPair(page, asset, exchange),
    });
    }

    browser.close();

    return images;
}

const processPair = async (page, asset, exchange) => {
  let image;

  try {
      if (exchange === 'Kucoin') {
        exchange = 'KuCoin';
      }

      if (exchange === 'Mexc') {
        return;
      }

      if (exchange == 'Gateio') {
        exchange = 'Gate'
      }
      
      //Search and select an asset
      await page.waitForSelector('#quickviewform-searchcoin');
      await page.type('#quickviewform-searchcoin', asset);
      await page.waitForSelector(`[data-value="${asset}-USDT-${exchange}"]`);
      await page.click(`[data-value="${asset}-USDT-${exchange}"]`);

      //Click 4h frame
      await page.waitForSelector(`#${asset}USDT > td:nth-child(4)`);
      await page.click(`#${asset}USDT > td:nth-child(4)`);

      //Display patterns on the chart
      await page.waitForSelector('#the-chart');
      await clickInput(page, '#ma50100-input');
      await clickInput(page, '#continuation_falling_wedge-input');
      await clickInput(page, '#reversal_falling_wedge-input');
      await clickInput(page, '#bullish_pennant-input');
      await clickInput(page, '#bull_flag-input');
      await clickInput(page, '#ascending_triangle-input');
      await clickInput(page, '#symmetrical_triangle-input');
      await clickInput(page, '#bearish_pennant-input');
      await clickInput(page, '#trendline-input');
      
      //move the cursor away
      await page.mouse.move(1, 1);

      // Capture a screenshot and save it as a JPG file
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec
      image = await page.screenshot({ type: 'jpeg', quality: 100, omitBackground: true });

      //Hide the chart and proceed to next asset if present
      await page.click('a.hide-chart');
  } catch (e) {
    console.log('An exception occured during drawing analysing chart for asset ', asset, e);
  }

  return image;
}

const login = async (page) => {
    //click login
    await page.click('body > div.dyor-main > div.dyor-content.scroll > div.dyor-header > div.dyor-home-menu > ul > li:nth-child(4) > a');
    
    //set email and pass
    await page.waitForSelector('#user-email');
    await page.type('#user-email', process.env.DYOR_USER);
    await page.type('#user-password', process.env.DYOR_PASS);

    //click submit
    await page.click('body > div.dyor-popin.dyor-standard-popin > div > div > div.signin-tab.tab.active > form > input[type=submit]');
 
    //wait for premium modal
    await page.waitForSelector('#premium-soon');
    //click submit
    await page.click('.close-popin');
}