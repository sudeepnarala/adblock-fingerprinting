import puppeteer, { Browser } from "puppeteer";

interface Features {
    not_scrollable : Boolean,
    ad_word_present : Boolean,
    block_word_present : Boolean,
    continue_word_present : Boolean,
    whitelist_word_present : Boolean,
};

class Detector {
    protected static browser : Browser;
    private static browserPromise : Promise<Browser>;
    private static adblock_path = "extensions/adblock";
    url: string;

    constructor(url : string) {        
        this.url = url;

        if (Detector.browserPromise)
            return;

        Detector.browserPromise = puppeteer.launch({
            headless: false,
            args: [
                `--disable-extensions-except=${Detector.adblock_path}`,
                `--load-extension=${Detector.adblock_path}`,
                '--no-sandbox'
            ]
        });
    }

    async detect() : Promise<Features> {
        // idempotent
        let browser : Browser = await Detector.browserPromise;
        let feature_vector = {} as Features;
        let page = await browser.newPage()
        await page.goto(this.url, {waitUntil: 'networkidle0'})

        let initial_y_pos : Number = await page.evaluate(() => {
            return window.scrollY;
        })
        // await page.keyboard.press("PageDown");

        await page.mouse.wheel({deltaY: 1000});

        await new Promise((temp) => setTimeout(temp, 100))
        
        let final_y_pos : Number = await page.evaluate(() => {
            return window.scrollY;
        })

        console.log(initial_y_pos, final_y_pos)

        feature_vector.not_scrollable = initial_y_pos == final_y_pos;
        
        [
            feature_vector.ad_word_present, 
            feature_vector.block_word_present, 
            feature_vector.continue_word_present,
            feature_vector.whitelist_word_present
        ] = await page.evaluate(() => {
            function isInViewport(element : Element) {
                const rect = element.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            }

            function evalRegex(regex : RegExp, text : string) : Boolean {
                return regex.exec(text) != null
            }

            const elements = document.body.querySelectorAll(':not(link):not(iframe):not(script):not(meta):not(li)');
            let ad_regex = new RegExp(".* ad.*");
            let block_regex = new RegExp(".*block.*")
            let continue_regex = new RegExp(".* continue.*")
            let whitelist_regex = new RegExp(".* whitelist.*")
            let ad_found : Boolean = false
            let block_found : Boolean = false
            let continue_found : Boolean = false
            let whitelist_found : Boolean = false
            for (const elem of elements) {
                if (!isInViewport(elem))
                    continue;
                let text : string = elem.innerHTML
                ad_found = ad_found || evalRegex(ad_regex, text)
                block_found = block_found || evalRegex(block_regex, text)
                continue_found = continue_found || evalRegex(continue_regex, text)
                whitelist_found = whitelist_found || evalRegex(whitelist_regex, text)
            }
            return [ad_found, block_found, continue_found, whitelist_found];
        });
        page.close()
        return feature_vector;
    }
}

export {Features, Detector};