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
        await page.goto('https://www.tgju.org/currency', {timeout: '90000'});
        await page.waitForSelector('.nf');
        let currency = await page.evaluate(() => {
            let data = {};
            const rows = document.querySelectorAll('.market-table tbody tr');
            const nameToCode = {
                "دلار"                   : "usd",
                "یورو"                  : "eur",
                "درهم امارات"           : "aed",
                "پوند انگلیس"           : "gbp",
                "لیر ترکیه"             : "try",
                "فرانک سوئیس"           : "chf",
                "یوان چین"              : "cny",
                "ین ژاپن (100 ین)"      : "jpy",
                "وون کره جنوبی"         : "krw",
                "دلار کانادا"            : "cad",
                "دلار استرالیا"          : "aud",
                "دلار نیوزیلند"          : "nzd",
                "دلار سنگاپور"           : "sgd",
                "روپیه هند"             : "inr",
                "روپیه پاکستان"         : "pkr",
                "دینار عراق"            : "iqd",
                "پوند سوریه"            : "syp",
                "افغانی"                : "afn",
                "کرون دانمارک"          : "dkk",
                "کرون سوئد"             : "sek",
                "کرون نروژ"             : "nok",
                "ریال عربستان"          : "sar",
                "ریال قطر"              : "qar",
                "ریال عمان"             : "omr",
                "دینار کویت"            : "kwd",
                "دینار بحرین"           : "bhd",
                "رینگیت مالزی"          : "myr",
                "بات تایلند"            : "thb",
                "دلار هنگ کنگ"           : "hkd",
                "روبل روسیه"            : "rub",
                "منات آذربایجان"        : "azn",
                "درام ارمنستان"         : "amd",
                "لاری گرجستان"           : "gel",
                "سوم قرقیزستان"         : "kgs",
                "سامانی تاجیکستان"      : "tjs",
                "منات ترکمنستان"        : "tmt"
            };
            rows.forEach((row) => {
                const name = row.querySelector('th:nth-child(1)').textContent.trim();

                let buyPrice = parseInt(row.querySelector('td:nth-child(2)').textContent.replaceAll(',', '').slice(0, -1));
                let buy = ((buyPrice > 10000 ) ? ((buyPrice) + (10 - (buyPrice)%10)) : buyPrice);
                buy = (name == "دینار عراق" ? buy * 100 : buy);
                let sellPrecentage = ((buy > 1000 ) ? Math.round(buy * 0.01) : Math.round(buy * 0.02));
                
                const code = nameToCode[name];
                 price = {
                    code: code,
                    name: row.querySelector('th:nth-child(1)').textContent.trim(),
                    sell: ((buy > 1000 ) ? ((buy + sellPrecentage) - (buy - sellPrecentage)%10) : (buy + sellPrecentage)),
                    buy: buy
                }
                data[code] = price;
            });

            return data;
        });
        rates.currency = currency;

        const goldprice = await page.$eval('#l-ons span span:nth-child(1)', el => el.textContent);
        // const goldprice = await page.$eval('#ounce_top', el => el.textContent);

        rates.goldprice = goldprice;
        res.status(200).json(rates);
    } catch (err) {
        res.status(500).send(`Somethine went wrong => \n ${err}`);
    } finally {
        browser.close();
    }
}
 module.exports = rate;