const fs = require('fs');

const textToJSON = (txtFile, jsonFile, titlePrefix) => {
    try {
        const text = fs.readFileSync(txtFile, 'utf8');
        const chapters = [{
            title: titlePrefix,
            content: text
        }];
        fs.writeFileSync(jsonFile, JSON.stringify({ chapters }));
        console.log('Converted', txtFile, 'to', jsonFile);
    } catch (e) {
        console.error('Failed to convert', txtFile, e);
    }
}

// But we deleted the files from `public/books` in the last commit! We need to recover them from history or we just restore them.
// Let's execute git checkout to get them back.
