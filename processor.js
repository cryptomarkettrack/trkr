import { drawChart } from './dyor.js'
import { fetchTopGainers } from './altsdaddy.js'
import { sendEmail } from './mailSender.js'
import { checkRateLimit, tweet } from './twitter.js'
import { deleteFilesInDirectory } from './utils.js'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

export const runProcessing = () => {
    (async () => {
        // fetch top gainers by price and volume from altsdaddy
        const topGainersData = await fetchTopGainers()
        let attachments = []

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
            const rateLimitData = await checkRateLimit()
            console.log('Rate limit data: ', rateLimitData)

            if (!rateLimitData.isRateLimited) {
                for await (const exchange of Object.keys(topGainersData.tweets)) {
                    // Replace Gateio to Gate
                    topGainersData.tweets[exchange].imagePath = `screenshots/${exchange.replaceAll('io', '')}.jpeg`

                    await new Promise(resolve => setTimeout(resolve, process.env.TWITTER_POST_INTERVAL_MS)) // 1 sec
                    tweet(topGainersData.tweets[exchange].text, topGainersData.tweets[exchange].imagePath)
                }
            } else {
                console.log('Rate limited on twitter. Fallback to email flow. Rate limit info: ', rateLimitData?.info)
                sendEmail("RATE LIMITED!!!\n\n" + topGainersData.textContent, attachments)
            }
        }

        // delete screenshots
        if (process.env.DELETE_FILES === 'true') {
            deleteFilesInDirectory('screenshots/')
        }
    })()
}
