const fs = require('fs');
const path = require('path');
const snoowrap = require('snoowrap');
const { r_userAgent, r_clientId, r_clientSecret, r_username, r_password } = require("./credentials");

// Initialize the snoowrap instance with your Reddit API credentials
const reddit = new snoowrap({
  userAgent: r_userAgent,
  clientId: r_clientId,
  clientSecret: r_clientSecret,
  username: r_username,
  password: r_password
});

// Define the subreddit, minimum and maximum character limit, and number of posts to download
const subreddit = 'Jokes';
const minChars = 450;
const maxChars = 600;
const numPosts = 3; // change this to the desired number of posts


// Get the current date and format it as 'DD.MM.YYYY'
const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');

// Create the txtFiles directory if it doesn't exist
const txtFiles = path.join(__dirname, 'txtFiles');
if (!fs.existsSync(txtFiles)) {
  fs.mkdirSync(txtFiles);
}

// Create the txtFiles directory if it doesn't exist
const txtDir = path.join(__dirname, 'txtFiles', currentDate + '-txt');
if (!fs.existsSync(txtDir)) {
  fs.mkdirSync(txtDir);
}


let numDownloaded = 0;
let numProcessed = 0;

const downloadPosts = (after = null) => {
  reddit.getSubreddit(subreddit).getNew({ limit: 100, after: after }).then(posts => {
    for (let post of posts) {
      numProcessed++;
      if (post.selftext.length >= minChars && post.selftext.length <= maxChars) {
        const date = new Date(post.created_utc * 1000).toLocaleDateString('en-GB').replace(/\//g, '.');
        const fileName = `${date}-${post.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')}.txt`;
        const filePath = path.join(txtDir, fileName);
        const fileContent = `${post.title}\n\n${post.selftext}`;
        fs.writeFile(filePath, fileContent, err => {
          if (err) {
            console.error(err);
          } else {
            numDownloaded++;
            console.log(`File ${fileName} generated.`);
          }
        });
        if (numDownloaded >= numPosts) {
          console.log(`Finished processing ${numProcessed} posts.`);
          return;
        }
      }
    }
    if (numDownloaded < numPosts && posts.length > 0) {
      const lastPost = posts[posts.length - 1];
      downloadPosts(lastPost.name);
    } else {
      console.log(`Finished processing ${numProcessed} posts.`);
    }
  }).catch(error => {
    console.error(error);
  });
}

downloadPosts();

