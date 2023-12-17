const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

// Get the current date and format it as 'DD.MM.YYYY'
const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');

// Create the soundVideoFiles directory if it doesn't exist
const txtDir = path.join(__dirname, 'soundVideoFiles', currentDate + '-sv');
if (!fs.existsSync(txtDir)) { fs.mkdirSync(txtDir); }

const audioFilesDir = path.join(__dirname, 'finalAudioFiles', currentDate + '-fAF');
const outputDir = path.join(__dirname, 'soundVideoFiles', currentDate + '-sv');
const bgVideosDir = 'bgVideos/';

// Get a list of audio files in the directory
fs.readdir(audioFilesDir, (err, audioFiles) => {
  if (err) { console.error('Error reading audio files directory:', err); return; }

  audioFiles.forEach((audioFile) => {
    // Get a random video file from the bgVideos directory
    fs.readdir(bgVideosDir, (err, videoFiles) => {
      if (err) { console.error('Error reading bgVideos directory:', err); return; }

      const videoFile = path.join(bgVideosDir, videoFiles[Math.floor(Math.random() * videoFiles.length)]);

      // Get the duration of the audio file using ffprobe
      const audioFilePath = path.join(audioFilesDir, audioFile);
      ffprobe(audioFilePath, { path: ffprobeStatic.path })
        .then((audioInfo) => {
          const audioDuration = audioInfo.streams[0].duration;

          // Merge the video and audio files using ffmpeg
          const mergedFile = path.join(outputDir, `${path.parse(audioFile).name}_merged.mp4`);
          ffmpeg()
            .input(videoFile)
            .input(audioFilePath)
            .outputOptions('-c:v copy')
            .outputOptions('-c:a aac')
            .outputOptions('-map 0:v:0')
            .outputOptions('-map 1:a:0')
            .output(mergedFile)
            .duration(audioDuration)
            .on('end', () => { console.log(`Finished merging ${audioFile} and ${videoFile}`); })
            .on('error', (err) => { console.error(`Error merging ${audioFile} and ${videoFile}:`, err); })
            .run();
        })
        .catch((err) => {
          console.error(`Error getting audio duration for ${audioFile}:`, err);
        });
    });
  });
});

