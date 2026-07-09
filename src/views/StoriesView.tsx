import React, { useState } from "react";
import { Bookmark, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useHardwareBack } from "../hooks/useHardwareBack";

export const StoriesView: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);

  useHardwareBack(selectedStory !== null, () => setSelectedStory(null));

  const stories = [
    {
      id: 1,
      title: "قصة آدم عليه السلام",
      summary: "أبو البشر وأول الأنبياء.",
      content:
        "خلق الله تعالى آدم عليه السلام بيديه من طين، ونفخ فيه من روحه، وأمر الملائكة بالسجود له تكريماً. سجد الملائكة جميعاً إلا إبليس أبى واستكبر. أسكن الله آدم وزوجته حواء الجنة، ونهاهما عن الأكل من شجرة معينة. فوسوس لهما الشيطان فأكلا منها، فأهبطهما الله إلى الأرض لتبدأ مسيرة البشرية وخلافتهم فيها.",
    },
    {
      id: 2,
      title: "قصة نوح عليه السلام",
      summary: "شيخ المرسلين وقصة الطوفان العظيم.",
      content:
        "أرسل الله نوحاً عليه السلام إلى قومه ليدعوهم إلى التوحيد وترك عبادة الأصنام. استمر في دعوتهم ألف سنة إلا خمسين عاماً، ولم يؤمن معه إلا قليل. فأمره الله بصنع سفينة، وأوحى إليه أن يحمل فيها من كل زوجين اثنين. ثم جاء الطوفان العظيم الذي أغرق الكافرين ومنهم ابنه، ونجى الله نوحاً ومن معه.",
    },
    {
      id: 3,
      title: "قصة إبراهيم عليه السلام",
      summary: "خليل الرحمن وبناء الكعبة.",
      content:
        "وُلد إبراهيم عليه السلام في بابل، ودعا قومه وأباه لترك عبادة الأصنام، فحطم أصنامهم، فألقوه في نار عظيمة جعلها الله برداً وسلاماً عليه. هاجر إلى الشام ثم إلى مكة، وأمره الله ببناء الكعبة المشرفة مع ابنه إسماعيل عليه السلام، وامتحنه الله بذبح ابنه ففداه بذبح عظيم.",
    },
    {
      id: 4,
      title: "قصة موسى عليه السلام",
      summary: "كليم الله وخروجه مع بني إسرائيل.",
      content:
        "وُلد موسى عليه السلام في عام يقتل فيه فرعون المواليد الذكور، فألقت أمه به في اليم، ليربى في قصر فرعون. كبر موسى وخرج إلى مدين، ثم عاد نبياً مرسلاً لفرعون وقومه. أيده الله بالمعجزات كالعصا واليد، وانتهت قصته مع فرعون بانشقاق البحر ونجاة بني إسرائيل وغرق فرعون وجنوده.",
    },
    {
      id: 5,
      title: "قصة عيسى عليه السلام",
      summary: "كلمة الله وروحه، ومعجزاته.",
      content:
        "عيسى عليه السلام هو نبي الله الذي ولد من السيدة مريم العذراء بكلمة من الله وبدون أب. أيده الله بمعجزات عظيمة كإبراء الأكمه والأبرص وإحياء الموتى بإذن الله. دعا بني إسرائيل لعبادة الله وحده، وتآمروا على قتله، لكن الله نجاه ورفعه إليه، وسينزل في آخر الزمان ليحكم بالعدل.",
    },
    {
      id: 6,
      title: "سيرة النبي محمد ﷺ",
      summary: "خاتم الأنبياء والمرسلين.",
      content:
        "ولد النبي محمد ﷺ في مكة يتيماً، وعُرف بالصادق الأمين. نزل عليه الوحي وهو في سن الأربعين في غار حراء. دعا إلى الإسلام في مكة وعانى من أذى قريش، فهاجر إلى المدينة المنورة حيث أسس دولة الإسلام. جاهد في سبيل الله حتى فتح مكة، وتوفي في المدينة المنورة بعد أن أكمل الله به الدين.",
    },
  ];

  if (selectedStory !== null) {
    const story = stories.find((s) => s.id === selectedStory);
    return (
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
        <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4 z-10">
          <button
            onClick={() => setSelectedStory(null)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </button>
          <h2 className="text-xl font-bold font-serif text-slate-800 dark:text-slate-100">
            {story?.title}
          </h2>
        </div>
        <div className="p-6 overflow-y-auto pb-24">
          <p className="text-lg leading-loose text-slate-700 dark:text-slate-300 font-serif">
            {story?.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <Bookmark className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-800 dark:text-slate-100">
            قصص الأنبياء
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            عبر وعظات من سير الأنبياء
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {stories.map((story, idx) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedStory(story.id)}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer hover:shadow-md transition-all active:scale-95"
          >
            <h3 className="font-bold text-lg font-serif text-slate-800 dark:text-slate-100 mb-2">
              {story.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {story.summary}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
