import puppeteer, { Browser } from "puppeteer";

export default class Detector {
    protected static browser : Browser;
    private static browserPromise : Promise<Browser>;
    private static adblock_path = "extensions/adblock";
    url: string;

    constructor(url : string) {
        if (this.constructor == Detector)
            throw new Error("Abstract class Detector cannot be instantiated directly");
        
        this.url = url;

        if (!Detector.browserPromise)
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

    async detect() : Promise<Boolean> {
        Detector.browser = await Detector.browserPromise;
        return this.detect_internal()
    }

    protected async detect_internal() : Promise<Boolean> {
        throw new Error("detect_internal method not overridden in subclass.")
    }
}