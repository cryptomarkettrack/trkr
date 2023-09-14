import { runProcessing } from './processor.js'

let processed = false
const splittedMinutes = process.env.SCHEDULE_MINUTES.split(',');

const checkAndExecute = () => {
    const now = new Date()
    const currentMinutes = now.getMinutes()
    const currentHours = now.getHours();
    const isPresentMinute = splittedMinutes.find(m => m === currentMinutes.toString());

    if (isPresentMinute &&
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

const sleepPrevention = () => {
    setInterval(() => {
        console.log('Sleep prevention started');
        fetch('https://trkr-ushk.onrender.com');
    }, 14 * 60 * 1000)
}

const main = () => {
    //prevent instance from sleeping
    sleepPrevention();

    if (process.env.IS_SCHEDULED === 'true' || process.env.IS_SCHEDULED === true) {
        setInterval(() => {
            checkAndExecute()
        }, process.env.SCHEDULE_INTERVAL)
    } else {
        runProcessing()
    }
}

main()
