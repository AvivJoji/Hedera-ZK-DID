const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../PRESENTATION.html');
const outputPath = path.join(__dirname, '../PRESENTATION_PORTABLE.html');
const imagesDir = path.join(__dirname, '../images');

try {
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Regex to find image sources pointing to the images directory
    // Matches src="images/filename.png"
    const regex = /src="images\/([^"]+)"/g;
    
    const newHtmlContent = htmlContent.replace(regex, (match, filename) => {
        const imagePath = path.join(imagesDir, filename);
        try {
            if (fs.existsSync(imagePath)) {
                const imageBuffer = fs.readFileSync(imagePath);
                const base64Image = imageBuffer.toString('base64');
                const ext = path.extname(filename).substring(1);
                const dataURI = `data:image/${ext};base64,${base64Image}`;
                console.log(`Embedded ${filename}`);
                return `src="${dataURI}"`;
            } else {
                console.warn(`Warning: Image not found: ${filename}`);
                return match;
            }
        } catch (err) {
            console.error(`Error processing ${filename}:`, err);
            return match;
        }
    });

    fs.writeFileSync(outputPath, newHtmlContent);
    console.log(`Successfully created portable presentation at: ${outputPath}`);

} catch (err) {
    console.error('Error processing HTML file:', err);
    process.exit(1);
}
