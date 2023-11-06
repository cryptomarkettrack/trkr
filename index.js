import { runProcessing } from './processor.js';

let processed = false;
const splittedMinutes = process.env.SCHEDULE_MINUTES.split(',');

const checkAndExecute = () => {
    const now = new Date();
    const currentMinutes = now.getMinutes();
    const currentHours = now.getHours();
    const hoursCondition = currentHours % 2 === 0; //every 2 hours
    const isPresentMinute = splittedMinutes.find(m => m === currentMinutes.toString());

    if (isPresentMinute &&
        // currentHours >= Number(process.env.SCHEDULE_FROM_HOURS) &&
        // currentHours <= Number(process.env.SCHEDULE_TO_HOURS) &&
        !processed
        && hoursCondition) {
        // Execute your code here
        console.log(`Code executed because current minutes are ${currentMinutes}.`);

        runProcessing();
        processed = true;
    } else {
        console.log('Current hour:', currentHours, ' minutes:', currentMinutes);
        processed = false;
    }
};

const main = () => {
    if (process.env.IS_SCHEDULED === 'true' || process.env.IS_SCHEDULED === true) {
        setInterval(() => {
            checkAndExecute();
        }, process.env.SCHEDULE_INTERVAL);
    } else {
        runProcessing();
    }
};

main();
