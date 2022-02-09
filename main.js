const { app, BrowserWindow, Menu } = require('electron')
const shell = require('electron').shell
const fs = require('fs')
const { resolve } = require('path')
//const dialog = require('electron').remote.dialog
//Automation Imports
const puppeteer = require('puppeteer')
const myHelper = require('lib/puppeteerAPI')
var config = require('configuration/config')

module.exports = {
	browserLaunchOptions: {
		headless: config.isHeadless,
		slowMo: config.slowMo,
		devtools: config.isDevtools,
		timeout: config.launchTimeout,
		defaultViewport: config.defaultViewport,
		viewport: config.defaultViewport,
		setViewportSize: config.defaultViewport,
		executablePath: config.browserPath,
		args: [
			'--start-maximized',
			'--no-sandbox',
			'--disable-setuid-sandbox',
			//'--disable-dev-shm-usage',
			//`--user-data-dir=${config.profilePath}`
		],
	},
}
let win = null
function createWindow() {
	win = new BrowserWindow({
		width: 1050,
		height: 790,
		webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
	})
	win.loadFile('ui/src/index.html')
}
if (app.commandLine.hasSwitch('base_url')) {
	// Mean Execute Test From CLI
	console.log(`Going to Exeute Test with CLI:`)
	let cli_URL = app.commandLine.getSwitchValue('base_url')
	let cli_userName = app.commandLine.getSwitchValue('user_name')
	let cli_userPassword = app.commandLine.getSwitchValue('user_password')
	let cli_folderPath = app.commandLine.getSwitchValue('folder_path')
	executeTest(cli_URL, cli_userName, cli_userPassword, cli_folderPath)
} else {
	var menu = Menu.buildFromTemplate([
		{
			label: 'Menu',
			submenu: [
				{ label: 'Open' },
				{
					label: 'Request Demo',
					click() {
						shell.openExternal(`mailto:rehmanazaz786@gmail.com`)
					},
				},
				{ type: 'separator' },
				{
					label: 'Exit',
					click() {
						app.quit()
					},
				},
			],
		},
		{
			label: 'Help',
			submenu: [
				{ label: 'Documentation' },
				{ type: 'separator' },
				{
					label: 'About Us',
					accelerator: 'Ctrl+O',
					click() {},
				},
				{
					label: '',
					click() {
						win.webContents.openDevTools()
					},
				},
			],
		},
	])
	Menu.setApplicationMenu(menu)
	app.whenReady().then(createWindow)

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	})

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
}
function openDevTools() {
	module.exports.dev = 1
	console.log(`Setting Dev ${module.exports.dev}`)
}
async function executeTest(designation, name, password, waitingTime,profilePath,browserPath,speed) {
	let myLogs = fs.createWriteStream('./Execution_Logs.log', { flag: 'a' })
	const data=JSON.parse([{"id":"message3915276","links":["","https://www.instagram.com/p/CYweKMOlOnn"]},{"id":"message3915252","links":["","https://www.instagram.com/p/CY8X6W9MmU1"]},{"id":"message3915234","links":["","https://www.instagram.com/p/CX_luWSNVIw"]},{"id":"message3915232","links":["","https://www.instagram.com/p/CY7DM1ss8dk"]},{"id":"message3915216","links":["https://www.instagram.com/p/CYS4H8ihtsC"]},{"id":"message3915204","links":["","https://www.instagram.com/p/CY8RVPRre3Y"]},{"id":"message3915175","links":["","https://www.instagram.com/p/CY7CWKprU5l"]},{"id":"message3915174","links":["","https://www.instagram.com/p/CY7lPRGg67O"]},{"id":"message3915164","links":["","https://www.instagram.com/p/CY4q2IOILrZ"]},{"id":"message3915158","links":["","https://www.instagram.com/p/CY8WUz-FMfE"]},{"id":"message3915124","links":["","https://www.instagram.com/p/CY3T4vdjLRp"]},{"id":"message3915118","links":["","https://www.instagram.com/p/CY59gl-o__x"]},{"id":"message3915107","links":["","https://www.instagram.com/p/CY7Bn6Yl-Va"]},{"id":"message3915102","links":["","https://www.instagram.com/p/CY8SI1TqcKU"]},{"id":"message3915098","links":["","https://www.instagram.com/p/CY68nN2KyQH"]},{"id":"message3915066","links":["","https://www.instagram.com/p/CY7d0YlAIh4"]},{"id":"message3915065","links":["","https://www.instagram.com/p/CY7zNTjFrKQ"]},{"id":"message3915052","links":["","https://www.instagram.com/p/CY8VAILs96D"]},{"id":"message3915035","links":["https://www.instagram.com/p/CY6ZJ9joCEz"]},{"id":"message3915032","links":["https://www.instagram.com/p/CY7YxtOJnB7"]},{"id":"message3915025","links":["","https://www.instagram.com/p/CYtCYsSAlBs"]},{"id":"message3915017","links":["","https://www.instagram.com/p/CY8TrYqIbtA"]},{"id":"message3915016","links":["","https://www.instagram.com/p/CY57DNAgaCZ"]},{"id":"message3915006","links":["","https://www.instagram.com/p/CY8USf3D569"]},{"id":"message3914993","links":["","https://www.instagram.com/p/CY6xDeNKCIb"]},{"id":"message3914988","links":["","https://www.instagram.com/p/CY5vNQ-Nqpo"]},{"id":"message3914964","links":["","https://www.instagram.com/p/CY53f28vJhp"]},{"id":"message3914949","links":["","https://www.instagram.com/p/CY4e7B5sSqF"]},{"id":"message3914913","links":["","https://www.instagram.com/p/CY4fk9YI66V"]},{"id":"message3914881","links":["","https://www.instagram.com/p/CY6zjl-LShR"]},{"id":"message3914879","links":["","https://www.instagram.com/p/CY8DyHmL7p-"]},{"id":"message3914869","links":["","https://www.instagram.com/p/CY1heqGIy3V"]},{"id":"message3914862","links":["","https://www.instagram.com/p/CY6u5-LMk1F"]},{"id":"message3914821","links":["","https://www.instagram.com/p/CY5UNzEo8qG"]},{"id":"message3914816","links":["","https://www.instagram.com/p/CY74nnFvFRN"]},{"id":"message3914808","links":["","https://www.instagram.com/p/CY2GRXnsULo"]},{"id":"message3914740","links":["","https://www.instagram.com/p/CY6rEd_LK-C"]},{"id":"message3914735","links":["","https://www.instagram.com/p/CY61UjolyoJ"]},{"id":"message3914732","links":["","https://www.instagram.com/p/CY8M_6RIJju"]},{"id":"message3914729","links":["","https://www.instagram.com/p/CY7lPRGg67O"]}])
	try {
		myLogs.write(`Execution Started\n`)
		//IF not Empty All then
		//config.baseURL = url
		config.userName = name
		config.password = password
		config.DESIGNATION_TO_SEARCH = designation
		config.stepWaitingTime=waitingTime*1000
		config.profilePath=profilePath
		config.browserPath=browserPath
		config.slowMo=speed
		// myLogs.write('Following Settings are updated\n')
		// myLogs.write(`User Name : ${config.userName}\n`)
		// myLogs.write(`Password : ${config.password}\n`)
		// myLogs.write(`Designation : ${config.DESIGNATION_TO_SEARCH}\n`)
		// myLogs.write(`Waiting Time : ${config.stepWaitingTime}\n`)
		// myLogs.write(`Profile Path : ${config.profilePath}\n`)
		// myLogs.write(`Browser Path : ${config.browserPath}\n`)
		// myLogs.write(`Browser Speed : ${config.slowMo}\n`)
		
			let page,browser = null
			try {
        //Browser Launch
				browser = await puppeteer.launch(module.exports.browserLaunchOptions)
				page = await browser.newPage()
				await page.setDefaultNavigationTimeout(180000)
				await page.setDefaultTimeout(180000)

				try {
					await page.goto(`https://www.instagram.com/accounts/login/`)
					page.on('dialog', async dialog => {
						await dialog.accept()
					})
					//Login to Linkddln
					myLogs.write(`Page Opened`)
					await myHelper.typeText(page,config.userName,`[id="username"]`)
					await myHelper.typeText(page,config.password,`[id="password"]`)
					await myHelper.clickWithNavigate(page,`[data-litms-control-urn="login-submit"]`)
					await page.waitForTimeout(config.stepWaitingTime/4)
					let finishTime = new Date().getTime() + (1 * 60 * 1000);
					await autoScroll(page,finishTime)

					await openNetworkToSendMessage(page,myLogs)
					//await browser.close()
				alert(
					'Your Execution is Completed Successfully. Review Execution Logs File for Deatil'
				)
				} catch (error) {
					myLogs.write(error)
				}
			} catch (error) {
				myLogs.write(`Error ${error}`)
				alert(
					`Error ${error}`
				)
			}
	} catch (error) {
		myLogs.write(`Error While Execute ${error}`)
	}
}
async function sendConnectRequest(page,username){

}
async function autoScroll(page, finishTime){
    await page.evaluate(async (finishTime) => {

        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight || new Date().getTime() > finishTime){

                    clearInterval(timer);
                    resolve();
                }

            }, 120);
        });
    }, finishTime);
}
async function openNetworkToSendMessage(page,myLogs){
	try {
		await myHelper.click(page,`[data-link-to="mynetwork"]`)
		let accepted= await myHelper.isExist(page,`//span[contains(text(),"accepted your invitation to connect")]`,60000)
		if(accepted){
			await sendThankYouMessage(page,myLogs)
		}
	} catch (error) {
		myLogs.write(`Error: ${error}`)
	}
}

async function sendThankYouMessage(page,myLogs){
	try {
		//await myHelper.click(page,`[data-link-to="mynetwork"]`)
		totalAcceptedInvites= await myHelper.getCount(page,`//span[contains(text(),"accepted your invitation to connect")]`)
		for (let index = 1; index <= totalAcceptedInvites.length; index++) {
			await myHelper.click(page,`(//button[contains(@aria-label,"Send message to")])[${index}]`)
			let name=await myHelper.getText(page,`[class*="profile-card-one-to-one__profile-link"]`)
			let messageBody=`Hi ${name},\n Thank You for Accepting My invitation.`
			await myHelper.typeText(page,messageBody,`[role="textbox"]`)
			await myHelper.click(page,`[type="submit"]`)
		}
		
	} catch (error) {
		myLogs.write(`Error: ${error}`)
	}
}