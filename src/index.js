const puppeteer = require('puppeteer')

// const data=JSON.parse(`[{"id":"message3915276","links":["",https://www.instagram.com/p/CYweKMOlOnn"]},{"id":"message3915252","links":["","https://www.instagram.com/p/CY8X6W9MmU1"]},{"id":"message3915234","links":["","https://www.instagram.com/p/CX_luWSNVIw"]},{"id":"message3915232","links":["","https://www.instagram.com/p/CY7DM1ss8dk"]},{"id":"message3915216","links":["https://www.instagram.com/p/CYS4H8ihtsC"]},{"id":"message3915204","links":["","https://www.instagram.com/p/CY8RVPRre3Y"]},{"id":"message3915175","links":["","https://www.instagram.com/p/CY7CWKprU5l"]},{"id":"message3915174","links":["","https://www.instagram.com/p/CY7lPRGg67O"]},{"id":"message3915164","links":["","https://www.instagram.com/p/CY4q2IOILrZ"]},{"id":"message3915158","links":["","https://www.instagram.com/p/CY8WUz-FMfE"]},{"id":"message3915124","links":["","https://www.instagram.com/p/CY3T4vdjLRp"]},{"id":"message3915118","links":["","https://www.instagram.com/p/CY59gl-o__x"]},{"id":"message3915107","links":["","https://www.instagram.com/p/CY7Bn6Yl-Va"]},{"id":"message3915102","links":["","https://www.instagram.com/p/CY8SI1TqcKU"]},{"id":"message3915098","links":["","https://www.instagram.com/p/CY68nN2KyQH"]},{"id":"message3915066","links":["","https://www.instagram.com/p/CY7d0YlAIh4"]},{"id":"message3915065","links":["","https://www.instagram.com/p/CY7zNTjFrKQ"]},{"id":"message3915052","links":["","https://www.instagram.com/p/CY8VAILs96D"]},{"id":"message3915035","links":["https://www.instagram.com/p/CY6ZJ9joCEz"]},{"id":"message3915032","links":["https://www.instagram.com/p/CY7YxtOJnB7"]},{"id":"message3915025","links":["","https://www.instagram.com/p/CYtCYsSAlBs"]},{"id":"message3915017","links":["","https://www.instagram.com/p/CY8TrYqIbtA"]},{"id":"message3915016","links":["","https://www.instagram.com/p/CY57DNAgaCZ"]},{"id":"message3915006","links":["","https://www.instagram.com/p/CY8USf3D569"]},{"id":"message3914993","links":["","https://www.instagram.com/p/CY6xDeNKCIb"]},{"id":"message3914988","links":["","https://www.instagram.com/p/CY5vNQ-Nqpo"]},{"id":"message3914964","links":["","https://www.instagram.com/p/CY53f28vJhp"]},{"id":"message3914949","links":["","https://www.instagram.com/p/CY4e7B5sSqF"]},{"id":"message3914913","links":["","https://www.instagram.com/p/CY4fk9YI66V"]},{"id":"message3914881","links":["","https://www.instagram.com/p/CY6zjl-LShR"]},{"id":"message3914879","links":["","https://www.instagram.com/p/CY8DyHmL7p-"]},{"id":"message3914869","links":["","https://www.instagram.com/p/CY1heqGIy3V"]},{"id":"message3914862","links":["","https://www.instagram.com/p/CY6u5-LMk1F"]},{"id":"message3914821","links":["","https://www.instagram.com/p/CY5UNzEo8qG"]},{"id":"message3914816","links":["","https://www.instagram.com/p/CY74nnFvFRN"]},{"id":"message3914808","links":["","https://www.instagram.com/p/CY2GRXnsULo"]},{"id":"message3914740","links":["","https://www.instagram.com/p/CY6rEd_LK-C"]},{"id":"message3914735","links":["","https://www.instagram.com/p/CY61UjolyoJ"]},{"id":"message3914732","links":["","https://www.instagram.com/p/CY8M_6RIJju"]},{"id":"message3914729","links":["","https://www.instagram.com/p/CY7lPRGg67O"]}]`)


// async function login(page){
//   try {
//     await page.goto(`https://www.instagram.com/accounts/login/`,{waitUntil:`networkidle0`})
//     await page.waitForSelector(`[name="username"]`)
//     await page.type(`[name="username"]`,``)
//     await page.waitForSelector(`[name="password"]`)
//     await page.type(`[name="password"]`,``)
//     await page.waitForSelector(`[type="submit"]`)
//     await page.click(`[type="submit"]`)
//     try {
//       await page.waitForSelector(`[role="main"] [type="button"]`,{timeout: 60000})
//       await page.click(`[role="main"] [type="button"]`)
//     } catch (error) {
//       console.log(`No issue ${error}`)
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }

async function run(rasturant_name, url) {
  let page, browser, result = null
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
      if (rasturant_name == 'redcarpet') {
        const {RedCarpet} = require('./rasturants/red_carpet') 
        const redcarpet = new RedCarpet(page,url)
        result=await redcarpet.open_menue()
      }
      result =result+ `I get Some Information WaOOOOOOOOO`

      // page.on('dialog', async dialog => {
      // 	await dialog.accept()
      // })
      await page.waitForTimeout(5000)
      await browser.close()
      
    } catch (error) {
      result =  result + error
      console.log(error)
    }finally{
      return result
    }
  } catch (error) {
    console.log(error)
  }

}
// run();



const express = require('express')
const res = require('express/lib/response')
const app = express()
const port = process.env.PORT || 3050
app.get('/', (req, res) => {
  res.type('text/plain')
  res.send('Server Expresso ☕')
})
app.post('/find_menue_by_rasturant_url', async function (request, response) {
  try {
    console.log(JSON.stringify(request.body));      // your JSON
    //response.send(request.body);    // echo the result back
    console.log('Abh Wahen hai')
    let url= request.query.url
    let name= request.query.rasturant_name
    result = await run(name,url)
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