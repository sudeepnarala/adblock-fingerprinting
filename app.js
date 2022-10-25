const fs = require("fs")
const puppeteer = require("puppeteer")
const path = require('path');

async function run_main() {
    const current_date = new Date()
    const directory_name = path.join('data', current_date.getFullYear() + "-" + current_date.getMonth() + "-" + current_date.getDate())
    console.log("Using directory: " + directory_name)
    if(!fs.existsSync(directory_name)) {
        fs.mkdirSync(directory_name)
    }
    const browser = await puppeteer.connect({ browserWSEndpoint: 'ws://localhost:3000' });
    const website_list = JSON.parse(fs.readFileSync("website_list.json"));
    for(const website of website_list.websites) {
        const { name, url } = website
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: 'load'});
        let scripts = await page.$$("script")
        let script_strings = []
        for(script_element of scripts) {
            const inner_html = await script_element.getProperty("innerHTML")
            script_strings.push(await inner_html.jsonValue())
        }
        // Under directory data (bind mounted), store DOM elements corresponding to script tags
        fs.writeFileSync(path.join(directory_name, name), JSON.stringify(script_strings))
        console.log("Completed scrape for "+name)
    }
}


if (require.main === module) {
    run_main()
}