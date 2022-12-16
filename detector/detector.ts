import puppeteer, { Browser } from "puppeteer";

interface Features {
    not_scrollable : Boolean,
    ad_word_present : Boolean,
    block_word_present : Boolean,
    continue_word_present : Boolean,
    whitelist_word_present : Boolean,
    ad_id : string,
    block_id : string,
    continue_id : string,
    whitelist_id : string
};

class Detector {
    protected static browser : Browser;
    private static browserLaunched : Boolean;
    private static browserPromise : Promise<Browser>;
    private static adblock_path = "extensions/adblock";
    url: string;

    constructor(url : string) {        
        this.url = url;

        if (Detector.browserLaunched)
            return;

        Detector.browserPromise = puppeteer.launch({
            headless: false,
	        // executablePath: "/home/mount/adblock/visiblev8_ads/chromium/src/out/Builder/chrome",
            args: [
               `--disable-extensions-except=${Detector.adblock_path}`,
               `--load-extension=${Detector.adblock_path}`,
                '--no-sandbox'
            ]
        });
        Detector.browserLaunched = true;
    }

    protected async detect_internal() : Promise<Boolean> {
        throw new Error('This function should be overridden');
    }

    async detect() : Promise<Boolean> {
        // idempotent
        Detector.browser = await Detector.browserPromise;
        // console.log(`Running detection on ${this.url}`);
        return this.detect_internal();
//         let feature_vector = {} as Features;
//         let page = await browser.newPage()
//         await page.goto(this.url, {waitUntil: 'networkidle0'})

//         let initial_y_pos : Number = await page.evaluate(() => {
//             return window.scrollY;
//         })
//         await page.keyboard.press("PageDown");

//  //       await page.mouse.wheel({deltaY: 1000});

//         await new Promise((temp) => setTimeout(temp, 100))
        
//         let final_y_pos : Number = await page.evaluate(() => {
//             return window.scrollY;
//         })

//         console.log(initial_y_pos, final_y_pos)

//         feature_vector.not_scrollable = initial_y_pos == final_y_pos;
        
//         [
//             feature_vector.ad_word_present, 
//             feature_vector.block_word_present, 
//             feature_vector.continue_word_present,
//             feature_vector.whitelist_word_present,
// 	    feature_vector.ad_id,
// 	    feature_vector.block_id,
// 	    feature_vector.continue_id,
// 	    feature_vector.whitelist_id
//         ] = await page.evaluate(() => {
//             function isInViewport(element : Element) {
//                 const rect = element.getBoundingClientRect();
//                 return (
//                     rect.top >= 0 &&
//                     rect.left >= 0 &&
//                     rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//                     rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//                 );
//             }

//             function evalRegex(regex : RegExp, text : string) : Boolean {
//                 return regex.exec(text) != null
//             }

//             const elements = document.body.querySelectorAll(':not(link):not(iframe):not(script):not(meta):not(li)');
//             let ad_regex = new RegExp(".* [Aa]d.*");
//             let block_regex = new RegExp(".*[Bb]lock.*")
//             let continue_regex = new RegExp(".* [cC]ontinue.*")
//             let whitelist_regex = new RegExp(".* [wW]hitelist.*")
//             let ad_found : Boolean = false
// 	    let ad_id : string = "";
//             let block_found : Boolean = false
// 	    let block_id : string = "";
//             let continue_found : Boolean = false
// 	    let continue_id : string = ""
//             let whitelist_found : Boolean = false
// 	    let whitelist_id : string = "";
//             for (const elem of elements) {
//                 if (!isInViewport(elem))
//                     continue;
//                 let text : string = elem.innerHTML
// 		let e_ad = evalRegex(ad_regex, text)
// 		let e_block = evalRegex(block_regex, text)
// 		let e_continue = evalRegex(continue_regex, text)
// 		let e_whitelist = evalRegex(whitelist_regex, text)
//                 ad_found = ad_found || e_ad
// 		if(e_ad) {
// 			ad_id = elem.className;
// 		}
//                 block_found = block_found || e_block
// 		if(e_block) {
//                         block_id = elem.className;
//                 }
//                 continue_found = continue_found || e_continue
// 		if(e_continue) {
//                         continue_id = elem.className;
//                 }
//                 whitelist_found = whitelist_found || e_whitelist
// 		if(e_whitelist) {
//                         whitelist_id = elem.className;
//                 }
//             }
//             return [ad_found, block_found, continue_found, whitelist_found, ad_id, block_id, continue_id, whitelist_id];
//         });
//         page.close()
//         return feature_vector;
    }
}

export {Features, Detector};
