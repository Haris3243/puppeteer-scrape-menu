const myHelper = require('./../lib/puppeteerAPI')
const selectors = require('./../constants/selectors')
class GoogleMenue {
    constructor(page, url) {
        this.page = page
        this.url = url
    }
    async get_menues() {
        try {
            
            await this.page.goto(this.url, { waitUntil: `networkidle0` })
            await this.page.waitForTimeout(3000)
            await myHelper.click(this.page,`button[jsaction][jslog*="mutable:true"]`)
            

            await myHelper.typeText(this.page,`This is a Name`, `[aria-label="Name"]`)
            await myHelper.typeText(this.page,`3251 S Miami Ave, Miami, FL 33129`, `[aria-label="Street address"]`,80)
            await this.page.waitForTimeout(3000)
            await this.page.keyboard.press('ArrowDown');
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(3000)
            await myHelper.typeText(this.page,`305-471-2260`, `[type="tel"]`)
            await myHelper.typeText(this.page,`azazrehman@gmail.com`, `textarea[rows="1"]`)

            await myHelper.click(this.page,`//span[text()="Save"]`)
            await myHelper.waitForXPath(this.page,`//span[text()="3251 S Miami Ave, Miami, FL, US, 33129"]`,60000)

            // await this.page.waitForTimeout(3000)
            // await myHelper.typeText(this.page,`Florida`,`[aria-label="Search restaurants or cuisines"]`)
            // await this.page.keyboard.press('Enter');
            // await this.page.waitForTimeout(6000)
            
            let rasturants={}
            let rasturant_array=[]
            // let menues = []
            // let response= {}
            // let response = new Object();
            // response.name = "Raj";
            // response.age  = 32;
            // response.married = false;

            

            let total_rasturants= await myHelper.getCount(this.page,`[aria-label="Restaurants"]>div`)
            for (let index = 1; index < total_rasturants; index++) {
                let rasturant_id = index
                //let rasturant_name= await myHelper.getText(this.page,`${selectors.rasturant_name_selector}`)
                let rasturant_name= await myHelper.getText(this.page,`(//*[@class="MhCP0d"])[${index}]`)
                console.log(`Rasturant No. ${index} Name: ${rasturant_name}`)
                var single_rasturant = {
                    "_id" :{
                        "$oid":`${rasturant_id}`
                    },
                    "menue":{},
                    "url":"https://xyz.com",
                    "restaurant_info": {
                        "type": "Juice BarsSmoothie Bar",
                        "images": [],
                        "name": `${rasturant_name}`,
                        "phone": "",
                        "address": {
                          "@type": "PostalAddress",
                          "addressLocality": "CORONADO",
                          "addressRegion": "CA",
                          "postalCode": "92118",
                          "streetAddress": "1138 ORANGE AVENUE"
                        }
                    }
                }
                //Object.assign(rasturants,single_rasturant)
                rasturant_array.push(single_rasturant)
            }
            Object.assign(rasturants,rasturant_array)
            //console.log(rasturants)
            return JSON.stringify(rasturants);
            
        } catch (error) {
            throw new Error(error)
        }
    }
    async get_menue(location_name,whole_menue){
        try {
            
        } catch (error) {
            throw new Error(error)
        }

    }
}

module.exports = {
    GoogleMenue
}