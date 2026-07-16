const fs = require('fs');

const textToJSON = (txtFile, jsonFile, titlePrefix) => {
    try {
        const text = fs.readFileSync(txtFile, 'utf8');
        // split by something, or just put it all in one chapter
        // Or if the content is just text, make chapters split by line?
        // Wait, the viewer supports both { hadiths: [] } and { chapters: [] }
        // Let's just create one big chapter for these books.
        const chapters = [{
            title: titlePrefix,
            content: text
        }];
        fs.writeFileSync(jsonFile, JSON.stringify({ chapters }));
        console.log('Converted', txtFile, 'to', jsonFile);
    } catch (e) {
        console.error(e);
    }
}

// Check what the original sayd.json or sayd.txt has
try {
    textToJSON('public/books/sayd.txt', 'public/books_json/sayd-khatir.json', 'صيد الخاطر');
    textToJSON('public/books/sirah.txt', 'public/books_json/sirah.json', 'السيرة النبوية');
    textToJSON('public/books/ruh.txt', 'public/books_json/ruh.json', 'كتاب الروح');
    textToJSON('public/books/rasael-nabi.txt', 'public/books_json/rasael-nabi.json', 'رسائل من النبي');
    textToJSON('public/books/rasael-quran.txt', 'public/books_json/rasael-quran.json', 'رسائل من القرآن');
} catch (e) {}
