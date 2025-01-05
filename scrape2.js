const puppeteer = require('puppeteer');
const rate2 = async function getRate(res) {
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
        let rates = {};
        const page = await browser.newPage();
        await page.goto('https://alanchand.com/currencies-price', {timeout: '90000', waitUntil: 'load'});
        let currency = await page.evaluate(() => {
            let data = {};
            const rows = document.querySelectorAll('a.arz_sync');
            rows.forEach((row) => {
                const code = row.getAttribute('slug');
                const price = {
                    code: row.getAttribute('slug'),
                    name: row.querySelector('div:nth-child(2)').textContent,
                    buy: row.querySelector('div:nth-child(3)').textContent.trim().replace(',', ''),
                    sell: row.querySelector('div:nth-child(4)').textContent.trim().replace(',', ''),
                }
                data[code] = price;
            });

            return data;
        });
        rates.currency = currency;

        await page.goto('https://goldprice.org/');
        const goldprice = await page.$eval('.gpoticker-price', el => el.textContent);
        // const goldprice = await page.$eval('#ounce_top', el => el.textContent);

        rates.goldprice = goldprice;
        res.status(200).json(rates);
    } catch (err) {
        res.status(500).send(`Somethine went wrong => \n ${err}`);
    } finally {
        browser.close();
    }
}
 module.exports = rate2;