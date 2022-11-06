const fs = require("fs")
const puppeteer = require("puppeteer")
const path = require('path');

const adblock_path = "extensions/adblock"

async function run_main() {
    const current_date = new Date()
    const root_directory = process.env.root_directory || "" // Keep "" as an option for non-container debugging
    const data_directory_name = path.join(root_directory, "data", current_date.getFullYear() + "-" + current_date.getMonth() + "-" + current_date.getDate())
    console.log("Using directory: " + data_directory_name)
    if(!fs.existsSync(data_directory_name)) {
        fs.mkdirSync(data_directory_name)
    }
    const browser = await puppeteer.launch(
        {
            headless: false,
            args: [
                `--disable-extensions-except=${adblock_path}`,
                `--load-extension=${adblock_path}`,
                '--no-sandbox'
            ]
        }
    )
    const website_list = JSON.parse(fs.readFileSync(path.join(root_directory, "website_list.json")));
    for(const website of website_list.websites) {
        const { name, url } = website
        console.log(`Starting scrape for ${name}`)
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: 'load'});
        let scripts = await page.$$("script")
        let script_strings = []
        for(script_element of scripts) {
            const inner_html = await script_element.getProperty("innerHTML")
            script_strings.push(await inner_html.jsonValue())
        }
        // Under directory data (bind mounted), store DOM elements corresponding to script tags
        fs.writeFileSync(path.join(data_directory_name, name), JSON.stringify(script_strings))
        console.log("Completed scrape for "+name)
    }
}


if (require.main === module) {
    run_main()
}