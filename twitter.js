import { TwitterApi } from 'twitter-api-v2'
import fs from 'fs'

// Replace with your Twitter API credentials
const client = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
    bearerToken: process.env.BEARER_TOKEN
})

const rwClient = client.readWrite

export const tweet = (text, imagePath) => {
    try {
    // lower path
        imagePath = imagePath.toLowerCase()

        if (imagePath && imagePath !== '' && fs.existsSync(imagePath)) {
            mediaTweet(text, imagePath)
        } else {
            tweetText(text)
        }
    } catch (e) {
        console.log('An error ocurred while tweeting.', e)
    }
}

// Create textTweet function which post
// a text only tweet
const tweetText = async (text) => {
    try {
    // Use .tweet() method and pass the
    // text you want to post
        await rwClient.v2.tweet(text)

        console.log('Tweet successful.')
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
        await rwClient.v2.tweet({
            text,
            media: { media_ids: [mediaId] }
        })
        console.log('Media tweet successful.')
    } catch (error) {
        console.log(error)
    }
}
