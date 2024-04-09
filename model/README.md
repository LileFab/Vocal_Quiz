# Voice Quiz - Model part

# Create Dataset
Download Mozilla Common Voices Fr (30Go)  
Keep Only Vaidated benchmark segment (3Go)  
Keep Only segment with ("oui, non, un, deux, trois, quatre) (182 Mo)  
Convert MP3 files to WAV (1.93Go)


## Convert mp3 to wav
Download [ffmpeg](https://ffmpeg.org/download.html)  before starting  

On Windows
```cmd
for %i in (*.mp3) do ffmpeg -i "%i" "../clips_wav/%~ni.wav"
```

On Linux
```bash
for file in *.mp3; do ffmpeg -i "clips_mp3/$file" "clips_wav/${file%.mp3}.wav"; done
```