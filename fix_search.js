const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/SearchableBookViewer.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import React, { useState, useMemo } from 'react';",
  "import React, { useState, useMemo, useDeferredValue } from 'react';"
);

content = content.replace(
  "const [searchQuery, setSearchQuery] = useState('');",
  "const [searchQuery, setSearchQuery] = useState('');\n  const deferredSearchQuery = useDeferredValue(searchQuery);"
);

content = content.replace(
  "if (!searchQuery.trim()) return data;",
  "if (!deferredSearchQuery.trim()) return data;"
);

content = content.replace(
  "const q = searchQuery.toLowerCase();",
  "const q = deferredSearchQuery.toLowerCase();"
);

content = content.replace(
  "}, [data, searchQuery]);",
  "}, [data, deferredSearchQuery]);"
);

fs.writeFileSync(file, content);
console.log("Fixed SearchableBookViewer.tsx");
