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
        await page.goto('https://bonbast.com/', {timeout: 60000});
        
        let currency = await page.evaluate(() => {
            let data = {};
            const rows = document.querySelectorAll('.table-condensed tbody tr:not(:first-child)');
            rows.forEach((row) => {
                const code = row.querySelector('td:nth-child(1)').textContent
                const price = {
                    code: row.querySelector('td:nth-child(1)').textContent,
                    name: row.querySelector('td:nth-child(2)').textContent,
                    sell: row.querySelector('td:nth-child(3)').textContent,
                    buy: row.querySelector('td:nth-child(4)').textContent
                }
                data[code] = price;
            });
            return data;
        });
        rates.currency = currency;
        const page2 = await browser.newPage();
        await page2.goto('https://goldprice.org', {timeout: 60000});
        const goldprice = await page2.$eval('.gpoticker-price', el => el.textContent);
        rates.goldprice = goldprice;

        // const page3 = await browser.newPage();
        // await page3.goto('https://coinmarketcap.com', {timeout: 60000});

        // let crypto = await page3.evaluate(() => {
        //     let data = {};
        //     const rows = document.querySelectorAll('table.etbcea tbody tr');
        //     rows.forEach((row) => {
        //         const code = row.querySelector('td:nth-child(3)').textContent;
        //         const price = {
        //             // code : row.getElementsByClassName('coin-item-symbol').textContent,
        //             // name : row.getElementsByClassName('coin-item-name').textContent,
        //             price : row.querySelector('td:nth-child(4)').innerText,
        //         }
        //         data[code] = price;
        //     });
        //     return data;
        // });

        // rates.crypto = crypto;
        res.status(200).json(rates);
    } catch (err) {
        res.status(500).send(`Somethine went wrong => \n ${err}`);
    } finally {
        browser.close();
    }
}
 module.exports = rate;