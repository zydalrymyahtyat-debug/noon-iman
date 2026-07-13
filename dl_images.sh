#!/bin/bash
curl -sL "https://upload.wikimedia.org/wikipedia/commons/f/f4/Quran.jpg" -o quran.jpg
curl -sL "https://upload.wikimedia.org/wikipedia/commons/8/87/Desert.jpg" -o stories.jpg
curl -sL "https://upload.wikimedia.org/wikipedia/commons/e/e5/Mosque.jpg" -o prayer.jpg
curl -sL "https://upload.wikimedia.org/wikipedia/commons/2/23/Two_bookshelves_full_of_books.jpg" -o library.jpg
curl -sL "https://upload.wikimedia.org/wikipedia/commons/c/cd/Masbaha.jpg" -o misbaha.jpg
curl -sL "https://upload.wikimedia.org/wikipedia/commons/b/ba/001124-MalwiyaMosque-Samerra-IMG_7824-2.jpg" -o mosque2.jpg
curl -sL "https://upload.wikimedia.org/wikipedia/commons/a/a7/Ezra_Cornell%27s_first_book.jpg" -o book.jpg
curl -sL "https://upload.wikimedia.org/wikipedia/commons/9/92/Al-Haram_mosque_-_Flickr_-_Al_Jazeera_English.jpg" -o kaaba.jpg
file *.jpg
