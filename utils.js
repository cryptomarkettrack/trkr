export const clickInput = async (page, selector) => {
    const elementHandle = await page.$(selector); // Replace with your selector

    if (elementHandle) {
      // Use page.evaluateHandle() to click the element
      await page.evaluateHandle((element) => {
        element.click();
      }, elementHandle);
    } else {
      console.error('Element not found');
    }
}