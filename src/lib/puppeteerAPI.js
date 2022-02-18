/**
 * This File contains wrapper functions for PlayWright and Puppeteer API
 */
const config = require('../configuration/config');
const waits = require('../constants/waits');
const delay = require('delay')
module.exports = {
	/**
	* Click on Any Element
	* 
	* @param  {DOM} page - page or a frame in which your selector exist which you want to click
	* @param  {string} selector - A selector which you want to click
	* @param  {Object} options - If you pass options Argument it override all existing options.
	* @param  {string} errorMessage - the mouse button which you want to triger, default button is left
	* @return {void} Nothing
	*/
	click: async function (page, selector, options, errorMessage = '', screenShot = { disabled: false }) {
		try {
			if (selector.startsWith('/') || (selector.startsWith('(/'))) {//Handle XPath
				await module.exports.click_xPath(page, selector)
			}
			else {
				await page.waitForSelector(selector, { timeout: config.waitingTimeout })
				await page.focus(selector)
				if (options) {//Check the truthy of Options Object
					await page.click(selector, options)
				}
				else {
					await page.click(selector)
				}
			}
		} catch (error) {

			throw new Error(`${errorMessage} | Could not click on selector: ${selector}  Detail Error:` + error)
		}
		finally {
			try {
				if (!screenShot.disabled) {
					await module.exports.takeScreenShot(page)
				}
			} catch (error) { }
		}
	},


	/**
	* Click on Any Element With Single Promise Navigation
	* 
	* @param  {DOM} page - page or a frame in which your selector exist which you want to click
	* @param  {string} selector - A selector which you want to click
	* @param  {string} button - the mouse button which you want to triger, default button is left 
	* @return {void} Nothing
	*/
	clickWithNavigate: async function (page, selector, button) {
		try {
			await Promise.all([
				module.exports.click(page, selector, button),
				page.waitForNavigation({ waitUntil: waits.networks.NETWORK_IDEAL_0/*,timeout:0*/ })
			])
		} catch (error) {
			if (error.code === 'PPTR_TIMEOUT') {

				console.log('Error While Navigating(Timeout): ' + error)
			}
			else {
				console.log('Error While Navigating: ' + error)
			}
		} finally {
			await module.exports.takeScreenShot(page)
		}
	},
	/**
	* Type a text on Any input type Element
	* 
	* @param  {DOM} page - page or a frame in which your selector exist and you want to type text in that
	* @param  {string} text - sequences of characters which you want to type
	* @param  {string} selector - A selector in which you want to type
	* @param  {number} myDelay - delay in typing the text on given selector, default delay is 80 milisecond
	* @param  {boolean} eventDispatch - If typing is not work properly you can set this flag as true and then try
	*/
	typeText: async function (page, text, selector, myDelay, eventDispatch = false) {
		try {
			if (myDelay == undefined) {
				myDelay = 80
			}
			if (eventDispatch && !selector.startsWith('//')) {
				await page.waitForSelector(selector, { timeout: config.waitingTimeout }),
					await page.evaluate((selector, text) => {
						const inputElement = document.querySelector(selector);
						const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
						nativeInputValueSetter.call(inputElement, text);
						const ev2 = new Event('input', { bubbles: true });
						inputElement.dispatchEvent(ev2);
					}, selector, text);
			}
			else {
				if (selector.startsWith('//') || (selector.startsWith('(//'))) {//Handle XPath
					await module.exports.typeTextXPath(page, text, selector)
				}
				else {
					await page.waitForSelector(selector, { timeout: config.waitingTimeout }),
						await Promise.all([
							page.focus(selector),
							page.click(selector, { clickCount: 3 }),
						]).catch(function (error) {
							throw new Error(`Could not type text into selector: ${selector} -> ${error}`)
						});
					await page.type(selector, text, { delay: myDelay })
				}
			}
		} catch (error) {

			throw new Error(`Could not type text into selector: ${selector} -> ${error}`)
		} finally {
			await module.exports.takeScreenShot(page)
		}
	},

	typeTextInTextObject: async function (page, text, selector, myDelay) {
		if (myDelay == undefined) {
			myDelay = 80
		}

		try {
			// await page.waitForSelector(selector, { timeout: config.waitingTimeout }),
			// await Promise.all([
			//     page.focus(selector),
			//     page.click(selector, { clickCount: 3 }),

			// ]).catch(function (error) {
			//     throw new Error(`Could not type text into selector: ${selector} -> ${error}`)
			// });
			await page.waitFor(1000);
			await page.type(selector, text, { delay: myDelay })

		} catch (error) {

			throw new Error(`Could not type text into text object: `)
		} finally {
			await module.exports.takeScreenShot(page)
		}
	},
	/**
	* Type a text on Any input type Element
	* 
	* @param  {DOM} page - page or a frame in which your selector exist and you want to type text in that
	* @param  {string} text - sequences of characters which you want to type
	* @param  {string} selector - A XPath selector in which you want to type
	*/
	typeTextXPath: async function (page, text, selector) {//TODO remove all typeTextXpath explicitly calls 
		try {
			await page.waitForXPath(selector)
			let inputField = await page.$x(selector)
			await inputField[0].focus(inputField)
			await inputField[0].click({ clickCount: 3 })
			await inputField[0].type(text)
		} catch (error) {

			throw new Error(`Could not type text into xPath selector: ${selector} -> ${error}`)
		} finally {
			await module.exports.takeScreenShot(page)
		}
	},
	/**
	 * Load A Given URL
	 * @param {*} page 
	 * @param {*} url 
	 */
	loadUrl: async function (page, url) {
		await page.goto(url, { waitUntil: waits.networks.NETWORK_IDEAL_0 })
	},
	/**
	* Get a text from DOM Element
	* 
	* @param  {DOM} page - page or a frame in which your selector exist and you want to type text in that
	* @param  {string} selector - A selector whose inside HTML text you want to retrieve
	* @return {string} inside text of an given HTML element
	*/
	getText: async function (page, selector, textOnly, maximumTime = 1000) {
		try {
			if (selector.startsWith('/') || (selector.startsWith('('))) {//Handle XPath
				await page.waitForXPath(selector, { timeout: maximumTime })
				let myElement = await page.$x(selector);
				return page.evaluate(el => el.textContent, myElement[0]);
			}
			else {
				await page.waitForSelector(selector, { timeout: config.waitingTimeout })
				if (textOnly) {

					return page.$eval(selector, e => e.innerText)
				}
				return page.$eval(selector, e => e.innerHTML)
			}

		} catch (error) {

			throw new Error(`Cannot get text from selector: ${selector} | ${error}`)
		}
	},
	/**
 * Get a text from DOM Element
 * 
 * @param  {DOM} page - page or a frame in which your selector exist and you want to type text in that
 * @param  {string} selector - xPath of element whose value is required
 * @param  {string} errorMessage - Error Message to send if error is thrown
 */
	getValue: async function (page, selector, errorMessage = '') {
		try {
			await page.waitForSelector(selector, { timeout: config.waitingTimeout })
			return await page.$eval(selector, selectedValue => selectedValue.value)
		} catch (error) {

			throw new Error(`${errorMessage} |Cannot get value from xPath: ${selector}`)
		}
	},
	/**
	* Get a Value of Provided Attribute from DOM Element
	* 
	* @param  {DOM} page - page or a frame in which your selector exist
	* @param  {string} selector - A selector whose inside attribute inner content you want to retrieve
	* @param  {string} attributeName - A name of Attribute whose value you want to retrieve, default attribute name is value
	* @return {string} provided attribute value is returned
	*/
	getAttributeValue: async function (page, selector, attributeName = "value", errorMessage = "") {
		try {
			let object = null
			if (selector.startsWith('/') || (selector.startsWith('(/'))) { //Mean XPATH
				await page.waitForXPath(selector)
				object = await page.$x(selector)
			} else {
				await module.exports.waitForSelector(page, selector)
				object = await page.$$(selector)
			}
			let attributeValue = await page.evaluate((el, attributeName) => el.getAttribute(attributeName), object[0], attributeName);
			return attributeValue
		} catch (error) {

			throw new Error(`${errorMessage} | Cannot get Attribute ${attributeName} Value from selector: ${selector}`)
		}
	},
	/**
	* Click on Any XPATH Element
	* 
	* @param  {DOM} page - page or a frame in which your selector exist which you want to click
	* @param  {string} selector - A XPATH selector which you want to click
	*/
	click_xPath: async function (page, selector) {//TODO remove all click_xPath explicitly calls 
		try {
			await page.waitForXPath(selector, { timeout: config.waitingTimeout });
			const [button] = await page.$x(selector);
			await Promise.all([
				button.click(),
			]);

		} catch (error) {

			throw new Error(`Could not click on the XPath: ${selector} ` + error);
		} finally {
			await module.exports.takeScreenShot(page)
		}
	},

	/**
	 * 
	 * @param {DOM} page - Broswer Pge where your slector exist 
	 * @param {string} selector- Selector value which you want to hover
	 * @param {number} index- element No. which you want to hover, default value is 0 point to first element
	 */
	hover: async function (page, selector, index = 0) {
		try {
			if (selector.startsWith('//')) {
				await page.waitForXPath(selector)
				let element = await page.$x(selector)
				await element[index].focus(element)
				await element[index].hover()
			}
			else {
				await page.waitForSelector(selector)
				await page.hover(selector)
			}
		} catch (error) {
			throw new Error(`Could not Hover on Selector ${selector}-> ${error}`)
		}
	},
	/**
   * 
   * @param {DOM} page - Broswer Pge where your slector exist 
   * @param {string} selector- Selector value which you want to hover
   */
	hoverXPath: async function (page, selector, timeOut) {
		try {
			await page.waitForXPath(selector)
			await page.hover(selector)

		} catch (error) {

			throw new Error(`Could not Hover on Selector ${selector}-> ${error}`)
		}
	},

	/**
	* Double click on given elemnnt reside on given page or frame
	* 
	* @param  {DOM} page - page or a frame where selector u want to findt
	* @param  {string} selector - A  selector on which u want to double click
	* @return {Void} Nothing
	*/
	doubleClick: async function (page, selector) {
		try {
			await page.waitForSelector(selector, { timeout: config.waitingTimeout })
			await page.evaluate(selector => {
				var targLink = document.querySelector(selector);
				var clickEvent = document.createEvent('MouseEvents');
				clickEvent.initEvent('dblclick', true, true);
				targLink.dispatchEvent(clickEvent);
			}, selector)
		} catch (error) {

			throw new Error(`Unable to double click on Selector: ${selector}`)
		} finally {
			await module.exports.takeScreenShot(page)
		}
	},
	/**
	* Double click on given elemnnt reside on given page or frame
	* 
	* @param  {DOM} page - page or a frame where selector u want to findt
	* @param  {string} selector - A  selector on which u want to double click
	* @param  {int} index - Element index to be double clicked
	* @return {Void} Nothing
	*/
	doubleClickXPath: async function (page, selector, index = 0) {
		try {
			await page.waitForXPath(selector, { timeout: config.waitingTimeout })
			let elementToDoubleClick = await page.$x(selector)
			await elementToDoubleClick[index].click()
			await elementToDoubleClick[index].click({ clickCount: 2 })

		} catch (error) {

			throw new Error(`Unable to double click on XPath Selector: ${selector}`)
		} finally {
			await module.exports.takeScreenShot(page)
		}
	},
	/**
	* Check Element is exist on page or not
	* 
	* @param  {DOM} page - page or a frame where selector u want to findt
	* @param  {string} selector - A  selector which u want to verify it exist or not on page or frame 
	* @param  {number} timeOut - timeOut Value to wait maximum for given selector
	* @return {boolean} true
	*/
	isExist: async function (page, selector, timeOut) {
		try {
			if (selector.startsWith('//') || selector.startsWith('(')) {//Handle XPath
				await page.waitForXPath(selector, { timeout: timeOut })
			} else {
				await page.waitForSelector(selector, { timeout: timeOut })
			}
			return true;
		} catch (error) {
			return false;
		}
	},
	/**
	* Wanit Until Specif Element Invisible or gone from a page or frame
	* 
	* @param  {DOM} page - page or a frame where selector u want to findt
	* @param  {string} selector - A  selector whose u want to wait for disappear
	* @param  {number} maximumTime - maximum time which u want to wait the element
	* @param  {string} faliureSelector - A selector, if it appear during waiting it means its faliure
	* @return {Void} Nothing
	*/
	waitUntilElementInvisible: async function (page, selector, maximumTime, faliureSelector) {
		let flag = false;
		try {
			var startTime = Date.now();
			do {
				let exist = await module.exports.isExist(page, selector, 1000)
				if (!exist) {
					flag = true;
					break;
				}
				if ((Date.now() - startTime) > maximumTime) {
					break;
				}
				if (faliureSelector != undefined) {
					let existFaliure = await module.exports.isExist(page, faliureSelector, 1000)
					if (existFaliure) {
						break;
					}
				}
				await delay(1000)
			} while (true);
		} catch (error) {

			throw new Error(`Unable to get invisible state of ${selector} within time ${maximumTime} -> ${error}`)
		}
		if (!flag) {
			throw new Error(`Selector ${selector} still exist within given time ${maximumTime}`)
		}

	},
	/**
	* Wait for Element by XPATH
	* 
	* @param  {DOM} page - page or a frame where selector u want to wait
	* @param  {string} selector - A XPATH selector which u want wait for visible
	* @return {Void} Nothing
	*/
	waitForXPath: async function (page, selector, timeout = config.waitingTimeout) {
		try {
			await page.waitForXPath(selector, { timeout: timeout })
		} catch (error) {

			throw new Error(error)
		}
	},
	/**
   * Wait for Element by its Query Selector
   * 
   * @param  {DOM} page - page or a frame where selector u want to wait
   * @param  {string} selector - A Query selector which u want wait for visible
   * @return {Void} Nothing
   */
	waitForSelector: async function (page, selector, timeout = config.waitingTimeout) {
		try {
			await page.waitForSelector(selector, { timeout: timeout })
		} catch (error) {

			throw new Error(error)
		}
	},
	/**
	* Select Value From DropDown menue
	* 
	* @param  {DOM} page - page or a frame where selector u want to findt
	* @param  {string} selectSelector - A dropdown select element
	* @param  {string} optionValue - an option value to select from options
	* @return {Void} Nothing
	*/
	selectValueFromDropDown: async (page, selectSelector, optionValue) => {
		try {
			await page.waitForSelector(selectSelector)
			await page.select(selectSelector, optionValue)
		} catch (error) {
			throw new Error(error)
		} finally {
			await module.exports.takeScreenShot(page)
		}
	},
	/**
	* Take screen shot of a Page
	* 
	* @param  {DOM} page - page or a frame whose screen shot u want to taken. 
	* For Frame it only Print error because frame class can't have screenshot function.
	* It save screenshots in tempScreenShots folder with timestamp. After each Test case end all these screens hots are converted to GIF and Delete images
	* @return {Void} Nothing
	*/
	takeScreenShot: async function (page) {
		try {
			//await page.screenshot({ path: `${config.TEMP_FILES_DIRECTORY}${Number(new Date())}.png` });
		} catch (error) {

			console.log('Error While Taking ScreenShot: ' + error)
		}
	},
	/**
   * Get Number of count of given Element
   * 
   * @param  {DOM} page - page or a frame in which your selector exist which you want to click
   * @param  {string} selector - A selector which you want to count
   * @return {number} total given HTML element at given page or frame
   */
	getCount: async function (page, selector) {
		try {
			await page.waitForSelector(selector)
			return page.$$eval(selector, items => items.length)
		} catch (error) {
			throw new Error(`Cannot get count of selector: ${selector}`)
		}
	},
	/**
	 * Get Number of count of given Element
	 * 
	 * @param  {DOM} page - page or a frame in which your selector exist which you want to click
	 * @param  {string} selector - A selector which you want to count
	 * @return {number} total given HTML element at given page or frame
	 */
	getCount_xPath: async function (page, selector) {
		try {
			await page.waitForXPath(selector)
			return page.$x(selector, items => items.length)
		} catch (error) {
			throw new Error(`Cannot get count of XPath: ${selector}`)
		}
	},

	switchFrame: async function (page, selector) {

		try {
			await page.waitForSelector(selector, { timeout: config.waitingTimeout })
			const frameHandle = await page.$(selector)
			const frame = await frameHandle.contentFrame();
			return frame
		} catch (error) {
			throw new Error(`Unable to switch to frame: ${error}`)
		}

	}




}//end of wrapper functions for PlayWright and Puppeteer API