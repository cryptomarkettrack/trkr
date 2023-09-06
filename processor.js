import { drawChart } from "./dyor.js";
import { fetchTopGainers } from "./altsdaddy.js"
import { sendEmail } from "./mailSender.js";
import { tweet } from "./twitter.js";
import { deleteFilesInDirectory } from "./utils.js";
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

export const runProcessing = () => {
    (async () => {
        //fetch top gainers by price and volume from altsdaddy
        const topGainersData = await fetchTopGainers();
        let attachments = [];
        
        // collect analytic images
        if (process.env.DYOR_ENABLED === 'true') {
            attachments = await drawChart(topGainersData.exchangeAssetMap)
            attachments = attachments.filter(a => a !== undefined)
        }

        // Send email
        (process.env.SEND_EMAIL_ENABLED === 'true') &&
            sendEmail(topGainersData.textContent, attachments)

        // Twitter post
        if (process.env.TWITTER_ENABLED === 'true') {
            Object.keys(topGainersData.tweets).forEach(exchange => {
                // Replace Gateio to Gate
                topGainersData.tweets[exchange].imagePath = `screenshots/${exchange.replaceAll('io', '')}.jpeg`

                tweet(topGainersData.tweets[exchange].text, topGainersData.tweets[exchange].imagePath)
            })
        }

        // delete screenshots
        if (process.env.DELETE_FILES === 'true') {
            deleteFilesInDirectory('screenshots/')
        }
    })()
}