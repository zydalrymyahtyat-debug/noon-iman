const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Add state for isFullScreen
app = app.replace(
  "const [currentView, setCurrentView] = useState<View>('home');",
  "const [currentView, setCurrentView] = useState<View>('home');\n  const [isFullScreen, setIsFullScreen] = useState(false);"
);

// Modify header
app = app.replace(
  /<header className="h-16 shrink-0 flex items-center justify-between px-4 bg-white dark:bg-slate-900 shadow-sm z-10 relative">/,
  `{!isFullScreen && (
      <header className="h-16 shrink-0 flex items-center justify-between px-4 bg-white dark:bg-slate-900 shadow-sm z-10 relative">`
);

app = app.replace(
  /<\/header>/,
  `</header>\n      )}`
);

// Modify nav
app = app.replace(
  /<nav className="h-20 shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-1 z-10 pb-4 pt-2 shadow-\[0_-4px_6px_-1px_rgba\(0,0,0,0.05\)\] overflow-x-auto">/,
  `{!isFullScreen && (
      <nav className="h-20 shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-1 z-10 pb-4 pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] overflow-x-auto">`
);

app = app.replace(
  /<\/nav>\n    <\/div>/,
  `</nav>\n      )}\n    </div>`
);

// Pass callback to QuranView
app = app.replace(
  "{currentView === 'quran' && <QuranView />}",
  "{currentView === 'quran' && <QuranView onFullScreenToggle={setIsFullScreen} />}"
);

// Reset full screen on navigation
app = app.replace(
  "setCurrentView(view);\n    }",
  "setCurrentView(view);\n      setIsFullScreen(false);\n    }"
);
app = app.replace(
  "setCurrentView(state.view);\n        exitPromptRef.current = false;",
  "setCurrentView(state.view);\n        setIsFullScreen(false);\n        exitPromptRef.current = false;"
);

fs.writeFileSync('src/App.tsx', app);
