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
