import { fetchReportContent } from './fetcher.js';

const isScheduled = true;
const REPORT_INTERVAL = 30000;

const checkAndExecute = () => {
    const now = new Date();
    const currentMinutes = now.getMinutes();

    if (currentMinutes === 59) {
        // Execute your code here
        console.log("Code executed because current minutes are 59.");
        fetchReportContent();
    } else {
        console.log("Current minutes:", currentMinutes);
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