module.exports = {
    /**
     * {BASE_URL}: 
     * must end with slash
     */
    baseURL: 'http://linkedln.com/',
    /**
     * {USER_NAME}: Username
     */
    userName: "test@email.com",
    /**
     * {PASSWORD}: Password
     */
    password: "myPassword",
    /**
     * {IS_HEADLESS}: Run Your Test in HEADLESS Mode ,
     * true: Run in background
     * false: View actions perform on browser
     */
    isHeadless: false,
    VIEW_PORT: "1920,870",
    
    slowMo: 50,
    /**
     * {IS_DEVELOPER_TOOL}: 
     * true:show developer tool with your each action 
     */
    isDevtools: false,
    /**
     * {LAUNCH_TIMEOUT}: Timeout in which Puppeteer Launch its browser 
     * must be in milliseconds
     */
    launchTimeout: 180000,
    /**
     * {WAITING_TIMEOUT}: Timeout used in  WaitForSelector 
     * must be in milliseconds
     */
    waitingTimeout: 50000,
    /**
     * {NAVIGATION_TIMEOUT}: Timeout used for navigation between the pages and new URL's 
     * must be in milliseconds
     */
    navigationTimeOut: 180000,
    
    /**
     * {DEFAULT_VIEW_PORT}: null for Maximized
     */
    defaultViewport: null,
    
    TEMP_FILES_DIRECTORY: "tempScreenShots/",
	DESIGNATION_TO_SEARCH:"SDET",
	stepWaitingTime:60000,
	browserPath:"mybrowser/chrome.exe",
	profilePath:"C:/testprofile",
}
