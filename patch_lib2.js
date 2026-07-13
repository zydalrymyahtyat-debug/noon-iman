const fs = require('fs');
let libData = fs.readFileSync('src/views/LibraryView.tsx', 'utf8');

const textViewerCode = `
const TextViewer: React.FC<{ url?: string }> = ({ url }) => {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!url) return;
    fetch(url)
      .then(res => res.text())
      .then(t => {
        setText(t);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [url]);

  if (loading) return <div className="p-10 text-center font-kufi text-slate-500 flex flex-col items-center gap-4"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>جاري تحميل الكتاب...</div>;
  if (!text) return <div className="p-10 text-center text-red-500">حدث خطأ أثناء التحميل</div>;

  const lines = text.split('\\n').filter(l => l.trim().length > 0).slice(0, 1500);

  return (
    <div className="font-kufi space-y-6 pb-20 text-slate-800 dark:text-slate-200 leading-loose text-lg">
      {lines.map((l, i) => (
        <p key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">{l}</p>
      ))}
      {text.split('\\n').filter(l => l.trim().length > 0).length > 1500 && (
        <div className="text-center p-6 text-slate-500 mt-10 border-t border-slate-200 dark:border-slate-800 text-sm">
          (تم عرض أول 1500 فقرة فقط لتجنب بطء الجهاز)
        </div>
      )}
    </div>
  );
};
`;

if (!libData.includes('TextViewer: React.FC')) {
  libData = libData.replace('export const LibraryView: React.FC = () => {', textViewerCode + '\nexport const LibraryView: React.FC = () => {');
}

libData = libData.replace(
  `{selectedBook.type === 'iframe' ? (`,
  `{selectedBook.type === 'text' ? (
            <TextViewer url={selectedBook.sourceUrl} />
          ) : selectedBook.type === 'iframe' ? (`
);

fs.writeFileSync('src/views/LibraryView.tsx', libData);
