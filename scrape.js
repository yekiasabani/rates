const puppeteer = require('puppeteer');
const rate = async function getRate(res) {
	const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
        ]
    });
    try {
        const page = await browser.newPage();
        await page.goto('https://bonbast.com/', {timeout: 60000});
        
        const rates = await page.evaluate(() => {
            let data = [];
            const rows = document.querySelectorAll('.table-condensed tbody tr:not(:first-child)');
            rows.forEach((row) => {
                const price = {
                    code: row.querySelector('td:nth-child(1)').textContent,
                    name: row.querySelector('td:nth-child(2)').textContent,
                    sell: row.querySelector('td:nth-child(3)').textContent,
                    buy: row.querySelector('td:nth-child(4)').textContent
                }
                data.push(price);
            });
            return data;
        });
        res.status(200).json(rates);
    } catch (err) {
        res.status(500).send(`Somethine went wrong => \n ${err}`);
    } finally {
        browser.close();
    }
}
 module.exports = rate;