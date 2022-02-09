const myHelper = require('../lib/puppeteerAPI')
class RedCarpet {
    constructor(page, url) {
        this.page = page
        this.url = url
    }
    async open_menue() {
        try {
            let whole_menue=`{ "redcarpet" : [`
            await this.page.goto(this.url, { waitUntil: `networkidle0` })
            //await myHelper.click(this.page,`[data-testid="linkElement"][href$="menu"]`)
            
            whole_menue=await this.get_menue(`8th-street`,whole_menue)
            whole_menue=await this.get_menue(`downtown`,whole_menue)
            whole_menue = `${whole_menue} ]` 
            return whole_menue
        } catch (error) {
            throw new Error(error)
        }
    }
    async get_menue(location_name,whole_menue){
        let item_price,item_description,item_name;
        whole_menue = `${whole_menue} { "${location_name}" : [` 
        await this.page.goto(`${this.url}/menu-${location_name}`, { waitUntil: `networkidle0` })
        let frameURL=await myHelper.getAttributeValue(this.page,`[title="Menus"]`,'src')
        await this.page.goto(frameURL, { waitUntil: `networkidle0` })
        //let frame=await myHelper.switchFrame(this.page,`[title="Menus"]`)
        let total_categories=await myHelper.getCount(this.page,`[id^="title"]`)
        for (let index = 1; index <= total_categories; index++) {
            let category_name = await myHelper.getText(this.page,`[id="subCategory${index}"]>[id="title${index}"]`,true)
            console.log(`Categry No ${index} | Detail ${category_name}`)
            
            whole_menue = `${whole_menue} { "${category_name}" : [`
            let total_items=await myHelper.getCount(this.page,`[id="subCategory${index}"] li`)
            for (let item_index = 1; item_index <= total_items; item_index++) {

                try {
                    item_name = await myHelper.getText(this.page,`(//li[@id="subCategory${index}"]//li//div[contains(@data-hook,"menus-item-title")])[${item_index}]`)
                    item_description = await myHelper.getText(this.page,`(//li[@id="subCategory${index}"]//li//div[contains(@data-hook,"menus-item-description")])[${item_index}]`)
                    item_price = await myHelper.getText(this.page,`(//li[@id="subCategory${index}"]//li//div[contains(@data-hook,"menus-item-price")])[${item_index}]`)
                } catch (error) {
                    console.log(`Error While geetting information of Category Name ${category_name} | Error: ${error}`)
                }
                //console.log(`Item No. ${item_index} Detail :${item_description} | ${item_price} | ${item_price}`)
                
                whole_menue = `${whole_menue} {"item_name":"${item_name}","price":"${item_price}","currency":"$","item_desciption":"${item_description}"}`
                if(item_index!=total_items){
                    whole_menue = `${whole_menue},`
                }
            }
            whole_menue = `${whole_menue} ]}`
            if(index!=total_categories){
                whole_menue = `,${whole_menue}`
            }
        }
        //whole_menue = `${whole_menue} [` 
        return whole_menue


    }
}

module.exports = {
    RedCarpet
}