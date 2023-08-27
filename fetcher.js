import { generateAnalysisImage } from "./analyzator.js";
import { sendEmail } from "./mailSender.js";

// Process function
const processData = json => {
    (async () => {

        let content = '';
        let attachments = [];
        for (const key of Object.keys(json.result)) {
            const obj = json.result[key];
            const exchange = obj.Exchange;
            console.log(`\n#${exchange}\n`);
            content += `------------------------------\n#${exchange}\n`;

            console.log(`⬆️ Price Increase 1h`);
            content += `⬆️ Price Increase 1h\n`;

            for (const [index, p] of obj.Pumps.entries()) {
                const asset = p[0];

                if (index === 0) {
                    const content = await generateAnalysisImage(asset, exchange)
                    attachments.push({
                        filename: `${asset}-${exchange}.png`,
                        content: content,
                    });
                }
                console.log(`$${asset} ▴${p[1]}%`);
                content += `$${asset} ▴${p[1]}%\n`;
            };


            console.log(`\n⬆️ Volume Increase 1h`);
            content += `\n⬆️ Volume Increase 1h\n`;
            obj.Activity.forEach(p => {
                const asset = p[0];
                console.log(`$${asset} ▴${p[1]}%`);
                content += `$${asset} ▴${p[1]}%\n`;
            });
        };

        console.log('atttachments', attachments);
        sendEmail(content, attachments);
    })();
}


export const fetchReportContent = () => {
    var myHeaders = new Headers();
    myHeaders.append("x-xsrf-token", "1692273107|D5fArTJAZGQA");
    myHeaders.append("authorization", "wixcode-pub.0575b1d1caf7b7cd22b366ff0fd5473f06354ce3.eyJpbnN0YW5jZUlkIjoiNzczOWY5ZDUtZTc0Yi00ZTMzLWJlYjYtMjZkMzNhNzgwZGUyIiwiaHRtbFNpdGVJZCI6Ijc3ZjNkZDc0LTA1YWQtNDAwMy04ZjE2LTYyNzI0MjY2OWM4YSIsInVpZCI6IjNmOTAyN2NjLTI5NDUtNDk3ZC1iYWI2LTM5MGUxNDAzMzcxYyIsInBlcm1pc3Npb25zIjpudWxsLCJpc1RlbXBsYXRlIjpmYWxzZSwic2lnbkRhdGUiOjE2OTIzMzMwOTYyNDMsImFpZCI6IjM5YmRlNzAwLWIyZDQtNDRjNy1hMTE2LWRhODgwNThkOWJhZiIsImFwcERlZklkIjoiQ2xvdWRTaXRlRXh0ZW5zaW9uIiwiaXNBZG1pbiI6ZmFsc2UsIm1ldGFTaXRlSWQiOiI3YTBjMzUzMS1mNzFkLTRmYjAtYjI2NS00ZWUwOTZmM2Y1ZmUiLCJjYWNoZSI6bnVsbCwiZXhwaXJhdGlvbkRhdGUiOiIyMDIzLTA4LTE4VDA4OjMxOjM2LjI0M1oiLCJwcmVtaXVtQXNzZXRzIjoiQWRzRnJlZSxIYXNEb21haW4sU2hvd1dpeFdoaWxlTG9hZGluZyIsInRlbmFudCI6bnVsbCwic2l0ZU93bmVySWQiOiI4NTRmNTgxNC1lN2E2LTRlZGUtOGEyNS0xMTZjNTNlMmIyYmQiLCJpbnN0YW5jZVR5cGUiOiJwdWIiLCJzaXRlTWVtYmVySWQiOiIzZjkwMjdjYy0yOTQ1LTQ5N2QtYmFiNi0zOTBlMTQwMzM3MWMiLCJwZXJtaXNzaW9uU2NvcGUiOm51bGwsImxvZ2luQWNjb3VudElkIjpudWxsfQ==");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json, text/plain, */*");
    myHeaders.append("x-wix-app-instance", "wixcode-pub.0575b1d1caf7b7cd22b366ff0fd5473f06354ce3.eyJpbnN0YW5jZUlkIjoiNzczOWY5ZDUtZTc0Yi00ZTMzLWJlYjYtMjZkMzNhNzgwZGUyIiwiaHRtbFNpdGVJZCI6Ijc3ZjNkZDc0LTA1YWQtNDAwMy04ZjE2LTYyNzI0MjY2OWM4YSIsInVpZCI6IjNmOTAyN2NjLTI5NDUtNDk3ZC1iYWI2LTM5MGUxNDAzMzcxYyIsInBlcm1pc3Npb25zIjpudWxsLCJpc1RlbXBsYXRlIjpmYWxzZSwic2lnbkRhdGUiOjE2OTIzMzMwOTYyNDMsImFpZCI6IjM5YmRlNzAwLWIyZDQtNDRjNy1hMTE2LWRhODgwNThkOWJhZiIsImFwcERlZklkIjoiQ2xvdWRTaXRlRXh0ZW5zaW9uIiwiaXNBZG1pbiI6ZmFsc2UsIm1ldGFTaXRlSWQiOiI3YTBjMzUzMS1mNzFkLTRmYjAtYjI2NS00ZWUwOTZmM2Y1ZmUiLCJjYWNoZSI6bnVsbCwiZXhwaXJhdGlvbkRhdGUiOiIyMDIzLTA4LTE4VDA4OjMxOjM2LjI0M1oiLCJwcmVtaXVtQXNzZXRzIjoiQWRzRnJlZSxIYXNEb21haW4sU2hvd1dpeFdoaWxlTG9hZGluZyIsInRlbmFudCI6bnVsbCwic2l0ZU93bmVySWQiOiI4NTRmNTgxNC1lN2E2LTRlZGUtOGEyNS0xMTZjNTNlMmIyYmQiLCJpbnN0YW5jZVR5cGUiOiJwdWIiLCJzaXRlTWVtYmVySWQiOiIzZjkwMjdjYy0yOTQ1LTQ5N2QtYmFiNi0zOTBlMTQwMzM3MWMiLCJwZXJtaXNzaW9uU2NvcGUiOm51bGwsImxvZ2luQWNjb3VudElkIjpudWxsfQ==");
    myHeaders.append("Referer", "https://www.altsdaddy.com/_partials/wix-thunderbolt/dist/clientWorker.4afff495.bundle.min.js");
    myHeaders.append("x-wix-site-revision", "3395");
    myHeaders.append("commonconfig", "%7B%22brand%22%3A%22wix%22%2C%22host%22%3A%22VIEWER%22%2C%22bsi%22%3A%2205c78765-2ddb-41e1-b122-b86939593eb6%7C1%22%2C%22BSI%22%3A%2205c78765-2ddb-41e1-b122-b86939593eb6%7C1%22%7D");
    myHeaders.append("Cookie", "XSRF-TOKEN=1692274016|9KqchoktjI46");

    var raw = JSON.stringify([]);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://www.altsdaddy.com/_api/wix-code-public-dispatcher-ng/siteview/_webMethods/backend/test.jsw/httpgetHome.ajax?gridAppId=350ba791-436b-4ad2-9918-55dc92c9b438&instance=wixcode-pub.0575b1d1caf7b7cd22b366ff0fd5473f06354ce3.eyJpbnN0YW5jZUlkIjoiNzczOWY5ZDUtZTc0Yi00ZTMzLWJlYjYtMjZkMzNhNzgwZGUyIiwiaHRtbFNpdGVJZCI6Ijc3ZjNkZDc0LTA1YWQtNDAwMy04ZjE2LTYyNzI0MjY2OWM4YSIsInVpZCI6IjNmOTAyN2NjLTI5NDUtNDk3ZC1iYWI2LTM5MGUxNDAzMzcxYyIsInBlcm1pc3Npb25zIjpudWxsLCJpc1RlbXBsYXRlIjpmYWxzZSwic2lnbkRhdGUiOjE2OTIzMzMwOTYyNDMsImFpZCI6IjM5YmRlNzAwLWIyZDQtNDRjNy1hMTE2LWRhODgwNThkOWJhZiIsImFwcERlZklkIjoiQ2xvdWRTaXRlRXh0ZW5zaW9uIiwiaXNBZG1pbiI6ZmFsc2UsIm1ldGFTaXRlSWQiOiI3YTBjMzUzMS1mNzFkLTRmYjAtYjI2NS00ZWUwOTZmM2Y1ZmUiLCJjYWNoZSI6bnVsbCwiZXhwaXJhdGlvbkRhdGUiOiIyMDIzLTA4LTE4VDA4OjMxOjM2LjI0M1oiLCJwcmVtaXVtQXNzZXRzIjoiQWRzRnJlZSxIYXNEb21haW4sU2hvd1dpeFdoaWxlTG9hZGluZyIsInRlbmFudCI6bnVsbCwic2l0ZU93bmVySWQiOiI4NTRmNTgxNC1lN2E2LTRlZGUtOGEyNS0xMTZjNTNlMmIyYmQiLCJpbnN0YW5jZVR5cGUiOiJwdWIiLCJzaXRlTWVtYmVySWQiOiIzZjkwMjdjYy0yOTQ1LTQ5N2QtYmFiNi0zOTBlMTQwMzM3MWMiLCJwZXJtaXNzaW9uU2NvcGUiOm51bGwsImxvZ2luQWNjb3VudElkIjpudWxsfQ==&viewMode=site", requestOptions)
        .then(response => response.json())
        .then(result => processData(result))
        .catch(error => console.log('error', error));
}