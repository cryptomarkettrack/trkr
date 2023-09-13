import { runProcessing } from './processor.js'

let processed = false
let interval = null

const checkAndExecute = () => {
    const now = new Date()
    const currentMinutes = now.getMinutes()
    const currentHours = now.getHours()

    if (process.env.SCHEDULE_MINUTES.includes(currentMinutes.toString()) &&
        currentHours >= Number(process.env.SCHEDULE_FROM_HOURS) &&
        currentHours <= Number(process.env.SCHEDULE_TO_HOURS) && !processed) {
    // Execute your code here
        console.log(`Code executed because current minutes are ${currentMinutes}.`)

        runProcessing()
        processed = true
    } else {
        console.log('Current hour:', currentHours, ' minutes:', currentMinutes)
        processed = false
    }
}

const main = () => {
    if (process.env.IS_SCHEDULED === 'true' || process.env.IS_SCHEDULED === true) {
        if (interval !== null) {
            clearInterval(interval)
        }

        interval = setInterval(() => {
            checkAndExecute()
        }, process.env.SCHEDULE_INTERVAL)
    } else {
        runProcessing()
    }
}

main()
