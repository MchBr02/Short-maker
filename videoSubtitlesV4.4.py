import os
import subprocess
from datetime import date

# Get the current date in the format "dd.mm.yyyy"
today = date.today().strftime("%d.%m.%Y")

# Specify the input directory containing video files
input_dir = os.path.join("soundVideoFiles", f"{today}-sv")

# Create the output directory if it doesn't exist
output_dir = os.path.join("subtitleVideoFiles", f"{today}-sVF")
os.makedirs(output_dir, exist_ok=True)

# Iterate over each file in the directory
for video_file in os.listdir(input_dir):
    if video_file.endswith(".mp4"):
        # Create the subtitle file name by replacing .mp4 with .srt
        subtitle_file = os.path.splitext(video_file)[0] + ".mp4.srt"
        subtitle_file_path = os.path.join("subtitles", f"{today}-sub", subtitle_file)

        # Specify the output video file name
        output_file = os.path.join("subtitleVideoFiles", f"{today}-sVF", video_file)

        # Use ffmpeg to burn the subtitles onto the video
        # Use the subtitles filter to add a karaoke effect to the subtitles
        subprocess.call(['ffmpeg', '-i', os.path.join(input_dir, video_file),
 '-vf',
 f'subtitles={subtitle_file_path}:force_style=\'Fontname=Roboto,Alignment=10,Fontsize=23,OutlineColour=&H00FF0000&,BorderStyle=1,Outline=2,ShadowColour=&H000000FF&,Shadow=3\'',
 '-c:a', 'copy', output_file])

