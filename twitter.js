import { TwitterApi } from 'twitter-api-v2'
import { TwitterApiRateLimitPlugin } from '@twitter-api-v2/plugin-rate-limit'
import fs from 'fs'
import { logError } from './utils.js'

let nextTwitterPostAttemptTimeInMs = null

// Replace with your Twitter API credentials
const rateLimitPlugin = new TwitterApiRateLimitPlugin()
const client = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
    bearerToken: process.env.BEARER_TOKEN
}, { plugins: [rateLimitPlugin] })

const rwClient = client.readWrite

export const checkRateLimit = async () => {

    if (nextTwitterPostAttemptTimeInMs != null && nextTwitterPostAttemptTimeInMs > Date.now()) {
        return {
            isRateLimited: true,
            info: 'CUSTOM TIMEOUT SET'
        }
    }

    // ...make requests...
    const me = await client.v2.me();
    console.log('Twitter status: ', me);

    const currentRateLimitForMe = await rateLimitPlugin.v2.getRateLimit('users/me')
    return {
        isRateLimited: rateLimitPlugin.hasHitRateLimit(currentRateLimitForMe),
        info: currentRateLimitForMe
    }
}

export const tweet = async (text, imagePath) => {
    try {
        // lower path
        imagePath = imagePath.toLowerCase()

        if (imagePath && imagePath !== '' && fs.existsSync(imagePath)) {
            await mediaTweet(text, imagePath)
            console.log('Media tweet successful')
        } else {
            await tweetText(text)
            console.log('Standard tweet successful')
        }

        // reset flag
        nextTwitterPostAttemptTimeInMs = null
    } catch (e) {
        console.log('An error ocurred while tweeting.', e)
        logError('An error ocurred while tweeting.', e)
        const twoHoursFromNow = Date.now() + 2 * 60 * 60 * 1000
        nextTwitterPostAttemptTimeInMs = twoHoursFromNow
    }
}

// Create textTweet function which post
// a text only tweet
const tweetText = async (text) => {
    try {
    // Use .tweet() method and pass the
    // text you want to post
        return await rwClient.v2.tweet(text)
    } catch (error) {
        console.log(error)
    }
}

// Create tweet function which post
// tweet with media and text
const mediaTweet = async (text, imagePath) => {
    try {
    // Create mediaID
        const mediaId = await rwClient.v1.uploadMedia(
            // Put path of image you wish to post
            imagePath
        )

        // Use tweet() method and pass object with text
        // in text feild and media items in media feild
        return rwClient.v2.tweet({
            text,
            media: { media_ids: [mediaId] }
        })
    } catch (error) {
        console.log(error)
    }
}
