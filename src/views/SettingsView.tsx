import React from 'react';
import { Settings, Moon, Bell, Info, Share2, Mail, Code, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const SettingsView: React.FC = () => {
  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-kufi text-slate-800 dark:text-slate-100">الإعدادات</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">تخصيص التطبيق</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <Moon className="w-5 h-5 text-indigo-500" />
              <span className="font-medium">الوضع الليلي (تلقائي مع النظام)</span>
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <Bell className="w-5 h-5 text-amber-500" />
              <span className="font-medium">إعدادات الإشعارات</span>
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <Share2 className="w-5 h-5 text-teal-500" />
              <span className="font-medium">مشاركة التطبيق</span>
            </div>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-4">
            <Info className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">نور الإيمان</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">الإصدار 1.0.0</p>
          <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3 text-right">
            <p>
              نور وإيمان هو تطبيق إسلامي يهدف إلى نشر العلم الشرعي وتيسير الوصول إلى المحتوى الإسلامي الموثوق، من خلال واجهة عربية بسيطة وسهلة الاستخدام تناسب جميع الفئات.
            </p>
            <p>
              يضم التطبيق مجموعة من الأقسام الإسلامية المفيدة، منها:
            </p>
            <ul className="list-disc list-inside space-y-1 pe-2 text-xs">
              <li>القرآن الكريم.</li>
              <li>كتاب الأصول الثلاثة.</li>
              <li>كتاب الأربعين النووية.</li>
              <li>كتاب الداء والدواء.</li>
              <li>قسم علامات الساعة.</li>
              <li>معلومات وفوائد إسلامية متنوعة.</li>
            </ul>
            <p>
              نسعى إلى تطوير تطبيق نور وإيمان باستمرار وإضافة المزيد من الكتب والمزايا التي تعين المسلم على طلب العلم، وتعزز الوعي الديني بأسلوب سهل ومنظم.
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">تطوير وبرمجة:</p>
              <p className="text-teal-600 dark:text-teal-400 font-bold text-lg">زيد الريمي</p>
              <div className="flex items-center justify-center gap-4 text-slate-500 pt-2 pb-2">
                 <a href="mailto:zaidalrimi@gmail.com" className="p-2 bg-slate-100 dark:bg-slate-800 hover:text-teal-600 transition-colors rounded-full shadow-sm">
                    <Mail className="w-5 h-5" />
                 </a>
                 <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 hover:text-teal-600 transition-colors rounded-full shadow-sm">
                    <Code className="w-5 h-5" />
                 </a>
              </div>
              <p className="text-amber-600 dark:text-amber-500 flex items-center justify-center gap-1 text-sm font-medium pt-2">
                <span>لاتنسونا من خالص دعائكم</span>
                <Heart className="w-4 h-4 fill-amber-500" />
              </p>
            </div>
            <p className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-center opacity-80 leading-relaxed">
              شكرًا لاستخدامكم تطبيق نور وإيمان. نرحب بجميع الملاحظات والاقتراحات التي تسهم في تطوير التطبيق، ونسأل الله أن يجعل هذا العمل خالصًا لوجهه الكريم، وأن ينفع به المسلمين، وأن يجعله في ميزان الحسنات.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
