const puppeteer = require('puppeteer')
const myHelper = require('./lib/puppeteerAPI')
let running = false;
async function execute_scrapping(rasturant_name, url) {
  let page, browser =null
  let rasturants = {}
  try {
    if(!running){
      try {
        //Browser Launch
        browser = await puppeteer.launch({
          headless: false,
          slowMo: 5,
          timeout: 120000,
          defaultViewport: null,
          viewport: null,
          setViewportSize: null,
          args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-setuid-sandbox']
        })
        page = await browser.newPage()
        await page.setDefaultNavigationTimeout(60000)
        await page.setDefaultTimeout(60000)
    
        try {
          //await login(page)
          await page.waitForTimeout(2000)
          // const { GoogleMenue } = require('./rasturants/google_menue')
          // const googleMenue = new GoogleMenue(page, url)
          // result = await googleMenue.get_menues()
    
          try {
                
            await page.goto(url, { waitUntil: `networkidle0` })
            running = true;
            await saveLocation(page)
            // await myHelper.typeText(page,`Florida`,`[aria-label="Search restaurants or cuisines"]`)
            // await page.keyboard.press('Enter');
            // await page.waitForTimeout(6000)
            
            
            let rasturant_array=[]
    
            
    
            let total_rasturants= await myHelper.getCount(page,`[aria-label="Restaurants"]>div`)
            console.log(`Total Rasturants: ${total_rasturants}`)
            for (let index = 1; index < 6; index++) {
                let rasturant_id = index
                //let rasturant_name= await myHelper.getText(page,`${selectors.rasturant_name_selector}`)
                let rasturant_name = "Default"
                try {
                    rasturant_name = await myHelper.getText(page,`(//*[@role="link"]//div/text()[string-length() > 5])[${index}]`)
                } catch (error) {
                    console.log(`Warning ! Raturant Not scrapped`)
                }
                console.log(`Rasturant No. ${index} Name: ${rasturant_name}`)
    
                //Scrapping Menues
                try {
                    await page.waitForXPath(`(//*[@role="link"]//div[contains(text()," ")])[${index}]`);
                    const [button] = await page.$x(`(//*[@role="link"]//div[contains(text()," ")])[${index}]`);
                    await Promise.all([
                        button.click(),
                    ]);
                    await page.waitForTimeout(10000)
        
                } catch (error) {
        
                    console.log(`Error ${error}`)
                }
                let address = `My Default Address`
                let websiteurl = `My Default URL`
                //await myHelper.clickWithNavigate(page,`(//*[@role="link"]//div[string-length() > 5])[${index}]`)
                try {
                  address = await myHelper.getText(page, `(//h2[text()="${rasturant_name}"]/following-sibling::div/div)[1]`)
                  await myHelper.click(page, `(//h2[text()="${rasturant_name}"]/following-sibling::div//span[text()="Website"])[2]`)
                  await page.waitForTimeout(4000)
                  const [tab1, tab2, tab3] = await browser.pages();
                  websiteurl = tab3.url()
                  await tab3.close()
                  await tab2.bringToFront()
                } catch (error) {
                  console.log(`Error while processing Rasturant ${rasturant_name} | ${error}`)
                }
                let isExist = await myHelper.isExist(page, `//div[text()="Menu"]`,5000)
                let menues= [ {"detail" : `No Information available at ${rasturant_name}`}]
                if(isExist){
                    menues = []
                    let total_catogries = await myHelper.getCount_xPath(page, `(//div[(contains(@data-section-id,"menusection/") or contains(@data-section-id,"categor")) and not(@aria-label)])`)
                    console.log(`Total Catogries Found for Rasturant ${rasturant_name} are ${total_catogries.length}`)
                    for (let catogries_index = 1; catogries_index < total_catogries.length - 1; catogries_index++) {
                        let items_array = []
                        let catogry_name = await myHelper.getText(page, `(//div[(contains(@data-section-id,"menusection/") or contains(@data-section-id,"categor")) and not(@aria-label)])[${catogries_index}]`)
        
                        let total_items = await myHelper.getCount_xPath(page, `(//div[(contains(@data-section-id,"menusection/") or contains(@data-section-id,"categor")) and not(@aria-label)])[${catogries_index}]/parent::div/following-sibling::div[@jsname]/div`)
                        
                        for (let item_index = 1; item_index < total_items.length - 1; item_index++) {
                            let item_name = `defaultName`
                            let item_active = true
                            let item_price = `0.0`
                            let item_description = `My Default Description`
                            try {
                                item_name = await myHelper.getText(page,`(((//div[contains(@data-section-id,"menusection/") or contains(@data-section-id,"categorization") and not(@aria-label)]/parent::div)[${catogries_index}]/following-sibling::div//div[@data-hashed-menu-item-id])[${item_index}]//div//div//div//div[contains(text(),"")])[1]`)
                                                                              
                                item_active = true 
                                //(((//div[contains(@data-section-id,"menusection/") or contains(@data-section-id,"categorization") and not(@aria-label)])[3]/parent::div/following-sibling::div//div[@data-hashed-menu-item-id])[1]//div[contains(text()," ")])[1]
                                item_price = await myHelper.getText(page,`(((//div[contains(@data-section-id,"menusection/") or contains(@data-section-id,"categorization") and not(@aria-label)]/parent::div)[${catogries_index}]/following-sibling::div//div[@data-hashed-menu-item-id])[${item_index}]//div[contains(text(),"$")])[1]`)
                                item_description = await myHelper.getText(page,`(((//div[contains(@data-section-id,"menusection/") or contains(@data-section-id,"categorization") and not(@aria-label)]/parent::div)[${catogries_index}]/following-sibling::div//div[@data-hashed-menu-item-id])[${item_index}]//div//div[contains(text()," ")])`)
                                console.log(`Successfuly Scrapper Rasturant ${rasturant_name} Category Name ${catogry_name} And Item ${item_name}`)
                            } catch (error) {
                                console.log(`Error ! Raturant ${rasturant_name} Menue is not scraped for category ${catogry_name} | ${error}`)
                            }
                            var single_item = {
                                "id": item_index,
                                "active": item_active,
                                "image": null,
                                "taxes": 0,
                                "__v": 0,
                                "name": item_name,
                                "title": item_name,
                                "price": item_price,
                                "description": item_description,
                                "priceCurrency": "USD",
                                "modifiers": [],
                                "options": []
                              }    
                            items_array.push(single_item)                        
                        }
                        //Emplty the Items Array, As Catory Items Are completed
                       
                        
                        var single_category = {
                                "id": `${catogries_index}`,
                                "active": true,
                                "name": `${catogry_name}`,
                                "items": {items_array}
                        }
                        items_array = []
                        menues.push(single_category)
                    }
                    
                }else{
                    console.log(`No Menue found for Rasturant ${rasturant_name}`)
                }
                //website = `(//h2[text()="Café Bastille"]/following-sibling::div//span[text()="Website"])[2]`
                var single_rasturant = {
                    "_id" :{
                        "$id":`Rasturant_${rasturant_id}`
                    },
                    "url":websiteurl,
                    "restaurant_info": {
                        "type": "My Raturant Type",
                        "images": [],
                        "name": `${rasturant_name}`,
                        "phone": "",
                        "address": address
                    },
                    "menues": menues
                }
                //Object.assign(rasturants,single_rasturant)
                rasturant_array.push(single_rasturant)
                menues = []
                await page.waitForTimeout(3000)
                try {
                  let back_selector = `(//div[@id="back_button"])[3]`
                  let back_selector_existance = await myHelper.isExist(page, back_selector ,6000)
                  if(!back_selector_existance){
                    back_selector = `(//div[@id="back_button"])[1]`
                  }
                  await myHelper.click(page,back_selector)
                } catch (error) {
                  try {
                    console.log(`Error while Attempting Back Click ${error}`)
                    await myHelper.click(page, `(//h1[text()="Order food"])[2]`)
                  } catch (error) {
                    console.log(`Error while retring Back Click ${error}`)
                  }
                }
                await page.waitForTimeout(5000)
                let isHomePage = await myHelper.isExist(page, `(//span[text()="Location unknown"])[1]`,5000)
                if(isHomePage){
                  //Again saving the location
                  await saveLocation(page)
                } 
            }
    
            Object.assign(rasturants,rasturant_array)
            console.log(JSON.stringify(rasturants))
            //return JSON.stringify(rasturants);
            
        } catch (error) {
          //rasturants = rasturants + error
          console.log(error)
        }
    
          // page.on('dialog', async dialog => {
          // 	await dialog.accept()
          // })
         
    
        } catch (error) {
          rasturants = rasturants + error
          console.log(error)
        } finally {
          await page.waitForTimeout(5000)
          await browser.close()
          return JSON.stringify(rasturants)
        }
      } catch (error) {
        console.log(error)
      }
    }
  } catch (error) {
    console.log(error)
  }
  

}

async function saveLocation(page){
  try {
    await page.waitForTimeout(3000)
    await myHelper.click(page,`button[jsaction][jslog*="mutable:true"]`)
    

    await myHelper.typeText(page,`This is a Name`, `[aria-label="Name"]`)
    await myHelper.typeText(page,`3251 S Miami Ave, Miami, FL 33129`, `[aria-label="Street address"]`,80)
    await page.waitForTimeout(7000)
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(4000)
    await myHelper.typeText(page,`305-471-2260`, `[type="tel"]`)
    await myHelper.typeText(page,`azazrehman@gmail.com`, `textarea[rows="1"]`)

    await myHelper.click(page,`//span[text()="Save"]`)
    await myHelper.waitForXPath(page,`//span[text()="3251 S Miami Ave, Miami, FL, US, 33129"]`,60000)

     await page.waitForTimeout(10000)
  } catch (error) {
    throw new Error(error)
  }
}
// execute_scrapping();



const express = require('express')
const res = require('express/lib/response')
const app = express()
const port = process.env.PORT || 3050
app.get('/test', async (request, res) => {
  res.type('text/plain')
  let url = 'http://food.google.com/'
  request.setTimeout(60000*10);
  //let name = request.query.rasturant_name
  let output  = await execute_scrapping('name', url)
  console.log(`My Final Result\n ${output}\n My Final Result`)
  res.send(output)
  
})
app.post('/find_menue_by_rasturant_url', async function (request, response) {
  try {
    console.log(JSON.stringify(request.body));      // your JSON
    //response.send(request.body);    // echo the result back
    console.log('Abh Wahen hai')
    let url = 'https://food.google.com/'
    let name = request.query.rasturant_name
    let result = await execute_scrapping(name, url)
    console.log('Wapis A GAYA')
    response.send(result);    // echo the result back
    console.log('Reuquest bhej di')
  } catch (error) {
    console.log(error)
    response.sendStatus(403)
  }

});
app.use(express.json())
app.listen(port,
  () => console.log(`Expresso ☕ is on Port ${port} Ctrl + C to Stop `))
  //app.setT
