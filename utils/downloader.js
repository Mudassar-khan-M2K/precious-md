const { exec } = require('child_process');
const util = require('util');
const fs = require('fs-extra');
const path = require('path');
const execPromise = util.promisify(exec);

async function downloadYouTube(url, format = 'mp3') {
    try {
        const outputDir = path.join(__dirname, '../temp');
        await fs.ensureDir(outputDir);
        
        const timestamp = Date.now();
        const outputPath = path.join(outputDir, `${timestamp}.${format === 'mp3' ? 'mp3' : 'mp4'}`);
        
        let command;
        if (format === 'mp3') {
            command = `yt-dlp -x --audio-format mp3 --audio-quality 128K -o "${outputPath}" "${url}"`;
        } else {
            command = `yt-dlp -f "best[height<=720]" -o "${outputPath}" "${url}"`;
        }
        
        await execPromise(command);
        
        if (await fs.pathExists(outputPath)) {
            const buffer = await fs.readFile(outputPath);
            await fs.remove(outputPath);
            return buffer;
        }
        
        throw new Error('Download failed');
    } catch (err) {
        console.error('Download error:', err);
        throw err;
    }
}

module.exports = { downloadYouTube };
