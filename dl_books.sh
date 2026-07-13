mkdir -p public/books

echo "Downloading Sahih Bukhari..."
curl -sL "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/ara-bukhari.json" > public/books/bukhari.json

echo "Downloading Sirah Nabawiyyah (Ibn Hisham)..."
curl -sL "https://raw.githubusercontent.com/nawaf-alageel/shamela-json/master/books/8/8.json" > public/books/sirah.json

echo "Downloading Kitab ar-Ruh..."
# Shamela ID for Kitab ar-Ruh is 3055. Let's see if it's in a shamela-json repo.
curl -sL "https://raw.githubusercontent.com/nawaf-alageel/shamela-json/master/books/3055/3055.json" > public/books/ruh.json

echo "Downloading Sayd al-Khatir..."
# Shamela ID for Sayd al-Khatir is 31697
curl -sL "https://raw.githubusercontent.com/nawaf-alageel/shamela-json/master/books/31697/31697.json" > public/books/sayd.json

ls -l public/books
