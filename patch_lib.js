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

  if (loading) return <div className="p-10 text-center font-kufi text-slate-500">جاري تحميل الكتاب...</div>;
  if (!text) return <div className="p-10 text-center text-red-500">حدث خطأ أثناء التحميل</div>;

  // Split text into lines, limit to 2000 lines to prevent lag
  const lines = text.split('\\n').filter(l => l.trim().length > 0).slice(0, 2000);

  return (
    <div className="font-kufi space-y-4 pb-20 text-slate-800 dark:text-slate-200 leading-loose text-lg">
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
      {text.split('\\n').length > 2000 && (
        <div className="text-center p-4 text-slate-500 mt-10 border-t border-slate-200 dark:border-slate-800">
          (تم عرض أول 2000 فقرة فقط لتجنب بطء الجهاز)
        </div>
      )}
    </div>
  );
};
`;

libData = libData.replace('export const LibraryView: React.FC = () => {', textViewerCode + '\nexport const LibraryView: React.FC = () => {');

libData = libData.replace(
  `} else selectedBook.type === 'json' ? (
            <BukhariViewer url={selectedBook.sourceUrl} />
          ) : (`,
  `} else selectedBook.type === 'json' ? (
            <BukhariViewer url={selectedBook.sourceUrl} />
          ) : (`
); // let's do a smarter replace

