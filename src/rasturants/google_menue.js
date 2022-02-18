const myHelper = require('./../lib/puppeteerAPI')
const selectors = require('./../constants/selectors')
class GoogleMenue {
    constructor(page, url) {
        this.page = page
        this.url = url
    }
    // async get_menues() {
    //     try {
            
    //         await this.page.goto(this.url, { waitUntil: `networkidle0` })
    //         await this.page.waitForTimeout(3000)
    //         await myHelper.click(this.page,`button[jsaction][jslog*="mutable:true"]`)
            

    //         await myHelper.typeText(this.page,`This is a Name`, `[aria-label="Name"]`)
    //         await myHelper.typeText(this.page,`3251 S Miami Ave, Miami, FL 33129`, `[aria-label="Street address"]`,80)
    //         await this.page.waitForTimeout(3000)
    //         await this.page.keyboard.press('ArrowDown');
    //         await this.page.keyboard.press('Enter');
    //         await this.page.waitForTimeout(3000)
    //         await myHelper.typeText(this.page,`305-471-2260`, `[type="tel"]`)
    //         await myHelper.typeText(this.page,`azazrehman@gmail.com`, `textarea[rows="1"]`)

    //         await myHelper.click(this.page,`//span[text()="Save"]`)
    //         await myHelper.waitForXPath(this.page,`//span[text()="3251 S Miami Ave, Miami, FL, US, 33129"]`,60000)

    //         // await this.page.waitForTimeout(3000)
    //         // await myHelper.typeText(this.page,`Florida`,`[aria-label="Search restaurants or cuisines"]`)
    //         // await this.page.keyboard.press('Enter');
    //         // await this.page.waitForTimeout(6000)
            
    //         let rasturants={}
    //         let rasturant_array=[]
    //         // let menues = []
    //         // let response= {}
    //         // let response = new Object();
    //         // response.name = "Raj";
    //         // response.age  = 32;
    //         // response.married = false;

            

    //         let total_rasturants= await myHelper.getCount(this.page,`[aria-label="Restaurants"]>div`)
    //         console.log(`Total Rasturants: ${total_rasturants}`)
    //         for (let index = 1; index < total_rasturants-1; index++) {
    //             let rasturant_id = index
    //             //let rasturant_name= await myHelper.getText(this.page,`${selectors.rasturant_name_selector}`)
    //             let rasturant_name = "Default"
    //             try {
    //                 rasturant_name = await myHelper.getText(this.page,`(//*[@role="link"]//div/text()[string-length() > 5])[${index}]`)
    //             } catch (error) {
    //                 console.log(`Warning ! Raturant Not scrapped`)
    //             }
    //             console.log(`Rasturant No. ${index} Name: ${rasturant_name}`)

    //             //Scrapping Menues
    //             try {
    //                 await this.page.waitForXPath(`(//*[@role="link"]//div[contains(text()," ")])[${index}]`);
    //                 const [button] = await this.page.$x(`(//*[@role="link"]//div[contains(text()," ")])[${index}]`);
    //                 await Promise.all([
    //                     button.click(),
    //                 ]);
    //                 await this.page.waitForTimeout(5000)
        
    //             } catch (error) {
        
    //                 console.log(`Error ${error}`)
    //             }
    //             //await myHelper.clickWithNavigate(this.page,`(//*[@role="link"]//div[string-length() > 5])[${index}]`)
    //             let isExist = await myHelper.isExist(this.page, `//div[text()="Menu"]`,30000)
    //             let menues= [ {"detail" : `No Information available at ${this.url}`}]
    //             if(isExist){
    //                 let items_array = []
    //                 let total_catogries = await myHelper.getCount_xPath(this.page, `//div[contains(@data-section-id,"menusection/") or contains(@data-section-id,"categorization") and not(@aria-label)]`)
    //                 console.log(`Total Catogries Found for Rasturant ${rasturant_name} are ${total_catogries}`)
    //                 for (let catogries_index = 1; catogries_index < total_catogries.length - 1; catogries_index++) {
    //                     let catogry_name = await myHelper.getText(this.page, `(//div[contains(@data-section-id,"menusection/") or contains(@data-section-id,"categorization") and not(@aria-label)])[${catogries_index}]`)
        
    //                     let total_items = await myHelper.getCount(this.page, `div[data-section-id^="menusection/"]`)
                        
    //                     for (let item_index = 1; item_index < total_items -1; item_index++) {
    //                         let item_name = `defaultName`
    //                         let item_active = true
    //                         let item_price = `0.0`
    //                         let item_description = `My Default Description`
    //                         try {
    //                             item_name = await myHelper.getText(this.page,`(((//div[contains(@data-section-id,"menusection/") or contains(@data-section-id,"categorization") and not(@aria-label)]/parent::div)[${catogries_index}]/following-sibling::div//div[@data-hashed-menu-item-id])[${item_index}]//div[contains(text()," ")])[1]`)
                                                                              
    //                             item_active = true 
    //                             //(((//div[contains(@data-section-id,"menusection/") or contains(@data-section-id,"categorization") and not(@aria-label)])[3]/parent::div/following-sibling::div//div[@data-hashed-menu-item-id])[1]//div[contains(text()," ")])[1]
    //                             item_price = await myHelper.getText(this.page,`(((//div[contains(@data-section-id,"menusection/") or contains(@data-section-id,"categorization") and not(@aria-label)]/parent::div)[${catogries_index}]/following-sibling::div//div[@data-hashed-menu-item-id])[${item_index}]//div[contains(text(),"$")])[1]`)
    //                             item_description = await myHelper.getText(this.page,`(((//div[contains(@data-section-id,"menusection/") or contains(@data-section-id,"categorization") and not(@aria-label)]/parent::div)[${catogries_index}]/following-sibling::div//div[@data-hashed-menu-item-id])[${item_index}]//div[contains(text()," ")])[2]`)
    //                         } catch (error) {
    //                             console.log(`Error ! Raturant ${rasturant_name} Menue is not scraped for category ${catogry_name} | ${error}`)
    //                         }
    //                         var single_item = {
    //                             "id": item_index,
    //                             "active": item_active,
    //                             "image": null,
    //                             "taxes": 0,
    //                             "__v": 0,
    //                             "name": item_name,
    //                             "title": item_name,
    //                             "price": item_price,
    //                             "description": item_description,
    //                             "priceCurrency": "USD",
    //                             "modifiers": [],
    //                             "options": []
    //                           }    
    //                         items_array.push(single_item)                        
    //                     }

    //                     var single_category = {
    //                             "id": `${catogries_index}`,
    //                             "active": true,
    //                             "name": `${catogry_name}`,
    //                             "items": items_array
    //                           }
                        
    //                 }
    //                 menues.push(single_category)
    //             }else{
    //                 console.log(`No Menue found for Rasturant ${rasturant_name}`)
    //             }
    //             var single_rasturant = {
    //                 "_id" :{
    //                     "$oid":`${rasturant_id}`
    //                 },
    //                 "menue":{},
    //                 "url":"https://xyz.com",
    //                 "restaurant_info": {
    //                     "type": "My Raturant Type",
    //                     "images": [],
    //                     "name": `${rasturant_name}`,
    //                     "phone": "",
    //                     "address": {
    //                       "@type": "PostalAddress",
    //                       "addressLocality": "CORONADO",
    //                       "addressRegion": "CA",
    //                       "postalCode": "92118",
    //                       "streetAddress": "1138 ORANGE AVENUE"
    //                     }
    //                 },
    //                 "menues": menues
    //             }
    //             //Object.assign(rasturants,single_rasturant)
    //             rasturant_array.push(single_rasturant)
    //             await myHelper.click(this.page,`(//div[@id="back_button"])[3]`)
    //             await this.page.waitForTimeout(5000)
    //         }

    //         Object.assign(rasturants,rasturant_array)
    //         console.log(rasturants)
    //         return JSON.stringify(rasturants);
            
    //     } catch (error) {
    //         throw new Error(error)
    //     }
    // }
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