const fs = require('fs');

// Patch LibraryView.tsx
let viewData = fs.readFileSync('src/views/LibraryView.tsx', 'utf8');

const bookRenderer = `
  const renderBookContent = () => {
    if (selectedBook.type === 'iframe') {
      return <div className="h-full" dangerouslySetInnerHTML={{ __html: selectedBook.content }} />;
    }
    if (selectedBook.type === 'json' && selectedBook.id === 'bukhari') {
      return <BukhariViewer url={selectedBook.sourceUrl} />;
    }
    return <div className="font-kufi leading-loose text-lg text-slate-800 dark:text-slate-200" dangerouslySetInnerHTML={{ __html: selectedBook.content }} />;
  };
`;

const bukhariViewerCode = `
const BukhariViewer: React.FC<{ url?: string }> = ({ url }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!url) return;
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [url]);

  if (loading) return <div className="p-10 text-center font-kufi text-slate-500">جاري تحميل الأحاديث...</div>;
  if (!data || !data.hadiths) return <div className="p-10 text-center text-red-500">حدث خطأ أثناء التحميل</div>;

  // Render a virtualized or limited list to prevent freezing
  return (
    <div className="font-kufi space-y-6 pb-20">
      {data.hadiths.slice(0, 100).map((h: any, i: number) => (
        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="text-teal-600 mb-2 font-bold">حديث رقم {h.hadithnumber}</div>
          <p className="text-slate-800 dark:text-slate-200 leading-loose">{h.text}</p>
        </div>
      ))}
      <div className="text-center p-4 text-slate-500">
        (تم عرض أول 100 حديث فقط لتجنب بطء الجهاز)
      </div>
    </div>
  );
};
`;

viewData = viewData.replace('export const LibraryView: React.FC = () => {', bukhariViewerCode + '\nexport const LibraryView: React.FC = () => {');

viewData = viewData.replace(
  '<div \n            className="font-kufi leading-loose text-lg text-slate-800 dark:text-slate-200"\n            dangerouslySetInnerHTML={{ __html: selectedBook.content }}\n          />',
  `{selectedBook.type === 'iframe' ? (
            <div className="w-full h-full pb-10" dangerouslySetInnerHTML={{ __html: selectedBook.content }} />
          ) : selectedBook.type === 'json' ? (
            <BukhariViewer url={selectedBook.sourceUrl} />
          ) : (
            <div 
              className="font-kufi leading-loose text-lg text-slate-800 dark:text-slate-200 pb-10"
              dangerouslySetInnerHTML={{ __html: selectedBook.content }}
            />
          )}`
);

fs.writeFileSync('src/views/LibraryView.tsx', viewData);

// Update library.ts interface
let libData = fs.readFileSync('src/data/library.ts', 'utf8');
libData = libData.replace(
  'export interface Book {\n  id: string;\n  title: string;\n  author: string;\n  description: string;\n  content: string;\n}',
  'export interface Book {\n  id: string;\n  title: string;\n  author: string;\n  description: string;\n  content: string;\n  type?: string;\n  sourceUrl?: string;\n}'
);
fs.writeFileSync('src/data/library.ts', libData);

