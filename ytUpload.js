const {Builder, By, Key, until} = require('selenium-webdriver');
const geckodriver = require("geckodriver");
const path = require('path');
const fs = require('fs');
const { yt_login, yt_password } = require("./credentials");

(async function example() {
    console.log("Starting the script...");

    let driver = await new Builder().forBrowser('firefox').build();
    try {
        // Navigate to the login page
        
        // Navigate to the YouTube upload page
        console.log('Navigating to the YouTube upload page...');
        await driver.get('https://studio.youtube.com/channel/UC_8aPB_9FC2M4ums6NLyKzw/videos/upload?d=ud');

        console.log('Inserting email');
        await driver.wait(until.elementLocated(By.css('input[type=email]')), 60000);
        await driver.findElement(By.css('input[type=email]')).sendKeys(yt_login);
        console.log('Clicking a button');
        await driver.findElement(By.css('#identifierNext > div > button')).click();
        console.log('Inserting password');
        await new Promise(resolve => setTimeout(resolve, 5000)); // wait for ? second's
        await driver.findElement(By.css('input[type="password"][name="Passwd"]')).sendKeys(yt_password);
        console.log('Clicking a button');
        await driver.findElement(By.css('#passwordNext > div > button')).click();


        // Wait for the page to load
        console.log('Waiting for the upload page to load...');
        //await driver.wait(until.titleIs('YouTube Studio'), 10000);
        await driver.wait(until.elementLocated(By.css('#ytcp-uploads-dialog-file-picker')), 60000);

        const inputField = await driver.findElement(By.css('input[type=file]'));

        //let filePath = 'C:\\Users\\micha\\OneDrive\\Pulpit\\30.04.2023-A-man-is-drowning-concatenated_merged.mp4';
        //const absolutePath = path.resolve(filePath);
        
        // Get the current date and format it as 'DD.MM.YYYY'
        const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');

        const directoryPath = path.join(__dirname, 'subtitleVideoFiles', currentDate + '-sVF');
        let files = fs.readdirSync(directoryPath);
        files = files.filter(file => file.endsWith('.mp4'));
        files = files.map(file => path.join(directoryPath, file));
        files.sort((a, b) => fs.statSync(b).ctime - fs.statSync(a).ctime);
        const newestFile = files[0];
        const absolutePath = path.resolve(newestFile);


        console.log('Uploading file');
        console.log(`Uploading file: ${newestFile}`);
        await inputField.sendKeys(absolutePath);

        //const submitButton = await driver.findElement(By.id('upload-button'));
        //await submitButton.click();
        console.log('File uploaded successfully!');

        // Wait for the file to upload
        console.log('Wait for a secound...'); await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Wait for a secound...'); await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Wait for a secound...'); await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Wait for > ytcp-button[id=next-button][aria-disabled=false]');
        await driver.wait(until.elementLocated(By.css('ytcp-button[id=next-button][aria-disabled=false]')), 60000);

        // Fill in the video title and description
        console.log('Filling in the video title and description...');
        //await driver.findElement(By.css('ytcp-social-suggestions-textbox[id=title-textarea] > ytcp-form-input-container > div > div > div > ytcp-social-suggestion-input > div[id=textbox]')).sendKeys(Key.chord(Key.CONTROL, 'a')); // Select all text
        //await driver.findElement(By.css('ytcp-social-suggestions-textbox[id=title-textarea] > ytcp-form-input-container > div > div > div > ytcp-social-suggestion-input > div[id=textbox]')).sendKeys('[Title] My awesome video'); // Set video title
        console.log('Wait for a secound...'); await new Promise(resolve => setTimeout(resolve, 3000));
        await driver.findElement(By.css('ytcp-social-suggestions-textbox[id=description-textarea] > ytcp-form-input-container > div > div > div > ytcp-social-suggestion-input > div[id=textbox]')).sendKeys('So funny :D'); // set video description
        console.log('Wait for a secound...'); await new Promise(resolve => setTimeout(resolve, 3000));

        //Set playlist
        console.log('Adding video to "Jokes" playlist');
        await driver.findElement(By.css("ytcp-video-metadata-playlists")).click();
        console.log('Wait for a secound...'); await new Promise(resolve => setTimeout(resolve, 2000));
        //await driver.findElement(By.xpath("//span[text()='Jokes']")).click();
        //await driver.findElement(By.xpath("//span[contains(text(), 'Jokes')]")).click();
        console.log('Wait for a secound...'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.xpath("//span[contains(@class, 'label-text') and text()='Jokes']")).click();
        
        console.log('Click: done-button'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("ytcp-button.done-button")).click()// ytcp-button.done-button
        
        console.log('Selecting: VIDEO_MADE_FOR_KIDS_NOT_MFK'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("tp-yt-paper-radio-group > tp-yt-paper-radio-button[name=VIDEO_MADE_FOR_KIDS_NOT_MFK]")).click(); // Nie przeznaczone dla dzieci

        console.log('Click: More options'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("ytcp-button[id=toggle-button]")).click(); // "Pokaż Więcej" opcji

        console.log('Add some tags'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("input[id=text-input]")).sendKeys('meme,mem,fynny,joke,laugh,lmao'); // adding Tags

        console.log('Click: Language list'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("ytcp-form-language-input > ytcp-form-select > ytcp-select > ytcp-text-dropdown-trigger > ytcp-dropdown-trigger ")).click(); // click > language.list

        console.log('Select language: englisch'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("tp-yt-paper-item[test-id=en] > ytcp-ve")).click(); // click englisch

        console.log('Click: Category'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("ytcp-form-select#category > ytcp-select > ytcp-text-dropdown-trigger > ytcp-dropdown-trigger")).click(); // Category

        console.log('Select Category: Humor'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("tp-yt-paper-item[test-id=CREATOR_VIDEO_CATEGORY_COMEDY] > ytcp-ve")).click(); // Category > Humor

        console.log('Click: "Next" button'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("ytcp-button[id=next-button]")).click(); // NEXT button

        console.log('Click: "Next" button'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("ytcp-button[id=next-button]")).click(); // NEXT button

        console.log('Click: "Next" button'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("ytcp-button[id=next-button]")).click(); // NEXT button

        console.log('Setting privacy of the video'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("tp-yt-paper-radio-button[id=private-radio-button]")).click(); // Set privacy

        console.log('Click: "Done" button'); await new Promise(resolve => setTimeout(resolve, 2000));
        await driver.findElement(By.css("ytcp-button[id=done-button]")).click(); // done-button

        console.log('Wait for a secound...'); await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Wait for a secound...'); await new Promise(resolve => setTimeout(resolve, 2000));

        // Wait for the video details page to load
        //console.log('Waiting for the video details page to load...');
        //await driver.wait(until.titleIs('Details'), 10000);

        // Fill in the video details (e.g. tags, visibility, etc.)
        //console.log('Filling in the video details...');
        //await driver.findElement(By.css('#basic-info-panel #tags-input')).sendKeys('my video, awesome');
        //await driver.findElement(By.css('#basic-info-panel .dropdown-trigger')).click();
       // await driver.findElement(By.css('.visibility-card [value="public"]')).click();

        // Click the "Publish" button
        //console.log('Clicking the "Publish" button...');
        //await driver.findElement(By.css('#publish-button')).click();

        // Wait for the video to be published
        //console.log('Waiting for the video to be published...');
        //await driver.wait(until.elementLocated(By.css('#video-published-message')), 60000);


        // Click the "Next" button
        //console.log('Clicking the "Next" button...');
        //await driver.findElement(By.css('#next-button')).click();

        
        console.log('Wait for a secound...'); await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('!FINISHED!'); await new Promise(resolve => setTimeout(resolve, 2000));


    } finally {
        console.log("Closing the browser...");
        await driver.quit();
        console.log("Browser closed");
    }
})();
