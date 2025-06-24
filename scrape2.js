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
        let rates = {};
        const page = await browser.newPage();
        await page.goto('https://alanchand.com/currencies-price', {timeout: '90000'});
        await page.waitForSelector('a.arz_sync');
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

        // await page.goto('https://alanchand.com/gold-price/usd_xau', {waitUntil: 'load'});
        // const goldprice = await page.$eval('.main-item div:nth-child(2)', el => el.textContent.replace('دلار', '').trim());
        // const goldprice = await page.$eval('#ounce_top', el => el.textContent);
        await page.goto('https://goldprice.org', {waitUntil: 'load'});
        const goldprice = await page.$eval('.gpoticker-price', el => el.textContent());

        rates.goldprice = goldprice;
        res.status(200).json(rates);
    } catch (err) {
        res.status(500).send(`Somethine went wrong => \n ${err}`);
    } finally {
        browser.close();
    }
}
 module.exports = rate;