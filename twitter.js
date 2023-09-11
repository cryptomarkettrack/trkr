import { TwitterApi } from 'twitter-api-v2'
import fs from 'fs'
import { logError, logInFile } from './utils.js'
import logger from './logger.js'

// 50 requests / 24 hours are allowed

let nextTwitterPostAttemptTimeInMs = null
let tweetsSent = 0
const initTime = Date.now()

export const initTwitter = () => {
// reset tweetsSent on each 24h
    setInterval(() => {
    // Check if it's been 24 hours (24 hours * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second)
        if (Date.now() - initTime >= 24 * 60 * 60 * 1000) {
            console.log('Resetting tweets sent to 0')
            logger.info('Resetting tweets sent to 0')
            tweetsSent = 0
            logInFile('tweets.log', tweetsSent)
        }
    }, 60 * 1000)
}

// Replace with your Twitter API credentials
const client = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
    bearerToken: process.env.BEARER_TOKEN
})

const rwClient = client.readWrite

export const checkRateLimit = async () => {
    if ((nextTwitterPostAttemptTimeInMs != null && nextTwitterPostAttemptTimeInMs > Date.now()) || tweetsSent > 49) {
        logger.info('Not allowing to process twitter flow since the next possible moment is at: ', new Date(nextTwitterPostAttemptTimeInMs), ', current sent tweets: ', tweetsSent)
        console.log('Not allowing to process twitter flow since the next possible moment is at: ', new Date(nextTwitterPostAttemptTimeInMs), ', current sent tweets: ', tweetsSent)
        return {
            isRateLimited: true,
            info: 'CUSTOM TIMEOUT SET'
        }
    }

    return {
        isRateLimited: false
    }
}

export const tweet = async (text, imagePath) => {
    try {
        // lower path
        imagePath = imagePath.toLowerCase()

        if (imagePath && imagePath !== '' && fs.existsSync(imagePath)) {
            await mediaTweet(text, imagePath)
            console.log('Media tweet successful')
            logger.info('Media tweet successful')
        
        } else {
            await tweetText(text)
            console.log('Standard tweet successful')
            logger.info('Standard tweet successful')
        }

        tweetsSent++
        console.log('Total tweets sent: ', tweetsSent)
        logger.info('Total tweets sent: ', tweetsSent)
        logInFile('tweets.log', tweetsSent)

        // reset flag
        nextTwitterPostAttemptTimeInMs = null
    } catch (e) {
        console.log('An error ocurred while tweeting.', e)
        logger.error('An error ocurred while tweeting.', e)
        logError('An error ocurred while tweeting.', e)
        const oneDayAndTwoMinutesFromNow = Date.now() + (2 * 1000) * (60 + 24 * 60 * 60 * 1000)
        nextTwitterPostAttemptTimeInMs = oneDayAndTwoMinutesFromNow
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
        logger.error(error)
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
        logger.error(error)
    }
}
