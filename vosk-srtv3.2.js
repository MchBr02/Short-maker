var vosk = require('vosk')
const path = require('path');
const fs = require("fs");
const { spawn } = require("child_process");
const { stringifySync } = require('subtitle')

// Get the current date and format it as 'DD.MM.YYYY'
const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');

// Create the output directory if it doesn't exist
const outDir = path.join(__dirname, 'subtitles', currentDate + '-sub');
if (!fs.existsSync(outDir)) { fs.mkdirSync(outDir); }


MODEL_PATH = "vosk-models/vosk-model-en-us-0.22-lgraph"
// vosk-model-en-us-0.22	1.8G
// vosk-model-en-us-0.22-lgraph	128M
// vosk-model-en-us-daanzu-20200905	1.0G
FILE_NAME = "16.04.2023-Guy-giving-a-lecture-on-the-paranormal-concatenated_merged.mp4"
SAMPLE_RATE = 16000 
BUFFER_SIZE = 4000

if (!fs.existsSync(MODEL_PATH)) {
    console.log("Please download the model from https://alphacephei.com/vosk/models and unpack as " + MODEL_PATH + " in the current folder.")
    process.exit()
}

if (process.argv.length > 2)
    FILE_NAME = process.argv[2]

FILE_DIR = path.join(__dirname, 'soundVideoFiles', currentDate + '-sv', FILE_NAME);
OUT_DIR = path.join(__dirname, 'subtitles', currentDate + '-sub', FILE_NAME);

vosk.setLogLevel(-1);
const model = new vosk.Model(MODEL_PATH);
const rec = new vosk.Recognizer({model: model, sampleRate: SAMPLE_RATE});
rec.setWords(true);

const ffmpeg_run = spawn('ffmpeg', ['-loglevel', 'quiet', '-i', FILE_DIR,
                         '-ar', String(SAMPLE_RATE) , '-ac', '1',
                         '-f', 's16le', '-bufsize', String(BUFFER_SIZE), '-']);

WORDS_PER_LINE = 3
const subs = []
const results = []
ffmpeg_run.stdout.on('data', (stdout) => {
    if (rec.acceptWaveform(stdout))
        results.push(rec.result());
    results.push(rec.finalResult());
});

ffmpeg_run.on('exit', code => {
    rec.free();
    model.free();
    results.forEach(element =>{
        if (!element.hasOwnProperty('result'))
            return;
        const words = element.result;
        if (words.length == 1) {
            subs.push({
                type: 'cue',
                data: {
                start: words[0].start * 1000,
                end: words[0].end * 1000,
                text: words[0].word.toUpperCase()
                }
            });
            return;
        }
        var start_index = 0;
        var text = words[0].word.toUpperCase() + " ";
        for (let i = 1; i < words.length; i++) {
            text += words[i].word.toUpperCase() + " ";
            if (i % WORDS_PER_LINE == 0) {
                subs.push({
                    type: 'cue',
                    data: {
                      start: words[start_index].start * 1000,
                      end: words[i].end * 1000,
                      text: text.slice(0, text.length-1)
                    }
                });
                start_index = i;
                text = "";
            }
        }
        if (start_index != words.length - 1)
            subs.push({
                type: 'cue',
                data: {
                  start: words[start_index].start * 1000,
                  end: words[words.length-1].end * 1000,
                  text: text
                }
            });
    });
    const subtitleString = stringifySync(subs, {format: "SRT"});
    fs.writeFileSync(`${OUT_DIR}.srt`, subtitleString);

//    console.log(stringifySync(subs, {format: "SRT"}));
    console.log(`${FILE_NAME}.srt`);
});
