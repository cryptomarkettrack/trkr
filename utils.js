import fs from 'fs'
import path from 'path'

export const clickInput = async (page, selector) => {
    const elementHandle = await page.$(selector) // Replace with your selector

    if (elementHandle) {
    // Use page.evaluateHandle() to click the element
        await page.evaluateHandle((element) => {
            element.click()
        }, elementHandle)
    } else {
        console.error('Element not found')
    }
}

export const deleteFilesInDirectory = (directoryPath) => {
    // Read the list of files in the directory
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err)
            return
        }

        // Loop through the files and delete each one
        files.forEach((file) => {
            const filePath = path.join(directoryPath, file)

            // Check if it's a file (not a subdirectory)
            fs.stat(filePath, (statErr, stats) => {
                if (statErr) {
                    console.error('Error getting file stats:', statErr)
                    return
                }

                if (stats.isFile()) {
                    // Delete the file
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error deleting file:', unlinkErr)
                        } else {
                            console.log(`Deleted file: ${file}`)
                        }
                    })
                }
            })
        })
    })
}

export const findTimeframeTargetBox = async (page, timeframe, asset, exchange) => {
    exchange = exchange.toLowerCase()

    let result = await page.$$eval(`a[href*="${timeframe}"]`, (a) => a.map((element) => {
        const href = element.getAttribute('href')
        return `a[href="${href}"]`
    }))

    result = result.filter((href, index) =>
        href.includes(asset) && href.includes(exchange) && href.includes('loadChart'))
        .filter(a => a !== undefined)

    return result?.length >= 1 ? result[0] : `#${asset}USDT > td:nth-child(4)`
}

export const logError = (errorMsg) => {
    const logFileName = 'error.log'

    // Create or append to the log file
    fs.appendFile(logFileName, `${new Date().toISOString()}: ${errorMsg}\n`, (err) => {
        if (err) {
            console.error('Error writing to log file:', err)
        }
    })
}
