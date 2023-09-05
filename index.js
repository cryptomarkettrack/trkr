import { fetchReportContent } from './fetcher.js'

const REPORT_INTERVAL = 30000
let processed = false

const checkAndExecute = () => {
    const now = new Date()
    const currentMinutes = now.getMinutes()
    const currentHours = now.getHours()

    if (currentMinutes === 59 && currentHours >= 8 && currentHours <= 21 && !processed) {
    // Execute your code here
        console.log('Code executed because current minutes are 59.')

        fetchReportContent()
        processed = true
    } else {
        console.log('Current hour:', currentHours, ' minutes:', currentMinutes)
        processed = false
    }
}

const main = () => {
    if (process.env.IS_SCHEDULED === 'true' || process.env.IS_SCHEDULED === true) {
        setInterval(() => {
            checkAndExecute()
        }, REPORT_INTERVAL)
    } else {
        fetchReportContent()
    }
}

main()
