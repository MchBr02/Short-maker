const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

// Get the current date and format it as 'DD.MM.YYYY'
const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');

// Create the finalAudioFiles directory if it doesn't exist
const finalAudioFilesDir = path.join(__dirname, 'finalAudioFiles', currentDate + '-fAF');
if (!fs.existsSync(finalAudioFilesDir)) {
  fs.mkdirSync(finalAudioFilesDir);
}

const introFileDir = path.join(__dirname, 'soundEffects', 'intorForJokes');
const mainFileDir = path.join(__dirname, 'audioFiles', currentDate + '-wav');

// Use fluent-ffmpeg to concatenate the intro file with each file in mainFileDir
fs.readdir(mainFileDir, function(err, mainFiles) {
  if (err) {
    console.log(err);
    return;
  }

  mainFiles.forEach((mainFile) => {
    const mainFilePath = path.join(mainFileDir, mainFile);
    const outputFilePath = path.join(finalAudioFilesDir, `${mainFile.replace('.mp3', '')}-concatenated.mp3`);

    // Use the fs module to read the contents of the introFile directory and choose a random mp3 file
    fs.readdir(introFileDir, function(err, introFiles) {
      if (err) {
        console.log(err);
        return;
      }

      const randomIndex = Math.floor(Math.random() * introFiles.length);
      const introFilePath = path.join(introFileDir, introFiles[randomIndex]);

      ffmpeg()
        .input(introFilePath)
        .input(mainFilePath)
        .on('error', function(err) {
          console.log('An error occurred: ' + err.message);
        })
        .on('end', function() {
          console.log(`Concatenation of ${introFilePath} and ${mainFilePath} finished! Output file saved as ${outputFilePath}.`);
        })
        .mergeToFile(outputFilePath, finalAudioFilesDir);
    });
  });
});

