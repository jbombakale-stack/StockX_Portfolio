
const fs = require('fs');
const path = require('path');

function removeComments(content) {
    // Regex to match strings or comments
    const pattern = /("(\\.|[^"\\])*"|'(\\.|[^'\\])*'|`(\\.|[^`\\])*`)|(\/\/[^\r\n]*)|(\/\*[\s\S]*?\*\/)/g;

    return content.replace(pattern, (match, string) => {
        // If it's a string (captured in the first group), return it as is
        if (string) {
            return string;
        }
        // Otherwise it's a comment, return empty string
        return "";
    });
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                const newContent = removeComments(content);

                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log(`Cleaned: ${file}`);
                }
            } catch (err) {
                console.error(`Error processing ${file}: ${err.message}`);
            }
        }
    });
}

console.log("Starting comment removal...");
processDirectory("src");
console.log("Comment removal complete.");
