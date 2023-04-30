const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {
    console.log("Starting the TokTok login script...");

    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Navigate to the login page
        console.log("Navigating to the login page...");
        await driver.get('https://www.tiktok.com/login/phone-or-email/email');

        // Find the username and password fields and fill in your credentials
        console.log("Entering login credentials...");
        await driver.findElement(By.name('username')).sendKeys('your_username');
        await driver.findElement(By.css('input[type=password]')).sendKeys('your_password');

        // Click the login button
        console.log("Waiting for 1 second before clicking the login button...");
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("Clicking the login button...");
        await driver.findElement(By.css('button[type=submit]')).click();
        
        // Wait until the dashboard page loads
        console.log("Waiting for the dashboard page to load...");
        await driver.wait(until.titleIs('Dashboard | TokTok'), 10000);
        
        console.log("Login successful!");
        // Perform further actions on the dashboard page as required

    } finally {
        console.log("Closing the browser...");
        await driver.quit();
    }
})();
