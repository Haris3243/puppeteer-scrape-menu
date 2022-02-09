# puppeteer-scrape-menu

Simple Scrapper through API using puppeteer.


## Steps to Initiate a Server:

1. Download & install the node
2. run `npm i` command in terminal where package.json is located
3. run `npm run scrapper`
4. When Message 'Expresso is on Port 3050' appears
5. Send a Request from Postman or from below mention Powershell command.


## For executing it through Powershell
Paste the below command in Powershell window and press Enter

     $headers=@{}
    $headers.Add("Content-Type", "application/json")
    $response = Invoke-WebRequest -Uri 'http://localhost:3050/find_menue_by_rasturant_url?rasturant_name=redcarpet&url=https%3A%2F%2Fwww.redcarpetrestaurant.com%2F' -Method POST -Headers $headers
    
##### Sample Request Example:

Sample Request Format:

URL with endpoint - `<localhost>`:3050/find_menue_by_rasturant_url

Request Method - POST

Query Parameters - 

    1. rasturant_name = redcarpet
    2. url = https://www.redcarpetrestaurant.com/


##### Note:


Rasturant used for this https://www.redcarpetrestaurant.com/
