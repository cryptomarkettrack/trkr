import { fetchReportContent } from './fetcher.js';

const isScheduled = true;
const REPORT_INTERVAL = 30000;
let processed = false;

const checkAndExecute = () => {
    const now = new Date();
    const currentMinutes = now.getMinutes();
    const currentHours = now.getHours();

    if (currentMinutes === 58 && currentHours > 6 && currentHours < 23 && !processed) {
        // Execute your code here
        console.log("Code executed because current minutes are 59.");
        
        fetchReportContent();
        processed = true;
    } else {
        console.log("Current hour:", currentHours, " minutes:", currentMinutes);
        processed = false;
    }
}

const main = () => {
    if (isScheduled) {
        setInterval(() => {
            checkAndExecute();
        }, REPORT_INTERVAL);
    } else {
        fetchReportContent();
    }
}

main();