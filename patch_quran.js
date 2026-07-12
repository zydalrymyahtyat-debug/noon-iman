const fs = require('fs');
let quran = fs.readFileSync('src/views/QuranView.tsx', 'utf8');

// Add props
quran = quran.replace(
  "export const QuranView: React.FC = () => {",
  "interface QuranViewProps {\n  onFullScreenToggle?: (isFullScreen: boolean) => void;\n}\n\nexport const QuranView: React.FC<QuranViewProps> = ({ onFullScreenToggle }) => {"
);

// Call onFullScreenToggle when selectedSurah changes
quran = quran.replace(
  "const [selectedSurah, setSelectedSurah] = useState<SurahReference | null>(null);",
  "const [selectedSurah, setSelectedSurah] = useState<SurahReference | null>(null);\n\n  useEffect(() => {\n    if (onFullScreenToggle) {\n      onFullScreenToggle(!!selectedSurah);\n    }\n  }, [selectedSurah, onFullScreenToggle]);"
);

// Update close to ensure we un-fullscreen
// useHardwareBack takes care of it, but just to be sure we already update based on selectedSurah state.
// No other changes needed since it's driven by `selectedSurah`.

fs.writeFileSync('src/views/QuranView.tsx', quran);
