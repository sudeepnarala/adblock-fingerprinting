import puppeteer, { Browser } from "puppeteer";

export default class Detector {
    static browser : Browser | Promise<Browser> = null;
    private static adblock_path : String = "extensions/adblock";
    url: String;
    constructor(url : String) {
        if(this.constructor == Detector) {
            throw new Error("Abstract class Detector cannot be instantiated directly");
        }
        this.url = url;
        if(!Detector.browser) {
            Detector.browser = puppeteer.launch(
                {
                    headless: false,
                    args: [
                        `--disable-extensions-except=${Detector.adblock_path}`,
                        `--load-extension=${Detector.adblock_path}`,
                        '--no-sandbox'
                    ]
                }
            )
        }
    }
    async detect() : Promise<Boolean> {
        Detector.browser = await Detector.browser
        return this.detect_internal()
    }

    async detect_internal() : Promise<Boolean> {
        throw new Error("detect_internal method not overridden in subclass.")
    }
}