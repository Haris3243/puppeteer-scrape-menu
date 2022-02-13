const puppeteer = require('puppeteer')

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
      const { GoogleMenue } = require('./rasturants/google_menue')
      const googleMenue = new GoogleMenue(page, url)
      result = await googleMenue.get_menues()

      // page.on('dialog', async dialog => {
      // 	await dialog.accept()
      // })
      await page.waitForTimeout(5000)
      await browser.close()

    } catch (error) {
      result = result + error
      console.log(error)
    } finally {
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
app.get('/', async (request, res) => {
  res.type('text/plain')
  let url = 'http://food.google.com/'
  //let name = request.query.rasturant_name
  result = await run('name', url)
  res.send(`Server Expresso ☕ | ${result}`)
})
app.post('/find_menue_by_rasturant_url', async function (request, response) {
  try {
    console.log(JSON.stringify(request.body));      // your JSON
    //response.send(request.body);    // echo the result back
    console.log('Abh Wahen hai')
    let url = 'https://food.google.com/'
    let name = request.query.rasturant_name
    result = await run(name, url)
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