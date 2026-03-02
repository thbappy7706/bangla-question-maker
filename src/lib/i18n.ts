import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'bn' | 'en';

interface LangStore {
    lang: Lang;
    setLang: (lang: Lang) => void;
    toggleLang: () => void;
}

export const useLangStore = create<LangStore>()(
    persist(
        (set, get) => ({
            lang: 'bn',
            setLang: (lang) => set({ lang }),
            toggleLang: () => set({ lang: get().lang === 'bn' ? 'en' : 'bn' }),
        }),
        { name: 'bqm-lang', version: 1 }
    )
);

const translations = {
    // Dashboard
    'app.title': { bn: 'প্রশ্ন মেকার', en: 'Question Maker' },
    'app.setCount': { bn: (n: number) => `${n}টি প্রশ্নসেট`, en: (n: number) => `${n} question set${n !== 1 ? 's' : ''}` },
    'app.new': { bn: 'নতুন', en: 'New' },
    'app.newMCQ': { bn: 'বহুনির্বাচনী প্রশ্ন সেট', en: 'MCQ Question Set' },
    'dashboard.empty.title': { bn: 'কোনো প্রশ্নসেট নেই', en: 'No question sets' },
    'dashboard.empty.desc': { bn: 'নতুন প্রশ্নসেট তৈরি করুন এবং প্রশ্ন যোগ করা শুরু করুন', en: 'Create a new question set and start adding questions' },
    'dashboard.empty.action': { bn: 'প্রথম প্রশ্নসেট তৈরি করুন', en: 'Create first question set' },
    'dashboard.unknownExam': { bn: 'অজানা পরীক্ষা', en: 'Untitled Exam' },
    'dashboard.totalQ': { bn: (n: number) => `মোট ${n}টি প্রশ্ন`, en: (n: number) => `Total ${n} question${n !== 1 ? 's' : ''}` },
    'dashboard.fullMarks': { bn: (n: number | string) => `পূর্ণমান ${n}`, en: (n: number | string) => `Full marks ${n}` },
    'dashboard.duration': { bn: (n: number | string) => `⏱ ${n} মিনিট`, en: (n: number | string) => `⏱ ${n} min` },

    // Set form
    'setForm.createTitle': { bn: 'নতুন প্রশ্নসেট তৈরি', en: 'Create New Question Set' },
    'setForm.editTitle': { bn: 'প্রশ্নসেট সম্পাদনা', en: 'Edit Question Set' },
    'setForm.institution': { bn: 'প্রতিষ্ঠানের নাম', en: 'Institution Name' },
    'setForm.institutionPh': { bn: 'যেমন: ঢাকা সরকারি বিদ্যালয়', en: 'e.g. Dhaka Govt. School' },
    'setForm.examName': { bn: 'পরীক্ষার নাম *', en: 'Exam Name *' },
    'setForm.examNamePh': { bn: 'যেমন: বার্ষিক পরীক্ষা ২০২৫', en: 'e.g. Annual Exam 2025' },
    'setForm.examNameErr': { bn: 'পরীক্ষার নাম দিন', en: 'Enter exam name' },
    'setForm.class': { bn: 'শ্রেণি', en: 'Class' },
    'setForm.classPh': { bn: 'যেমন: দশম', en: 'e.g. Ten' },
    'setForm.subject': { bn: 'বিষয়', en: 'Subject' },
    'setForm.subjectPh': { bn: 'যেমন: বাংলা', en: 'e.g. Bangla' },
    'setForm.fullMarks': { bn: 'পূর্ণমান', en: 'Full Marks' },
    'setForm.fullMarksPh': { bn: '১০০', en: '100' },
    'setForm.duration': { bn: 'সময় (মিনিট)', en: 'Duration (min)' },
    'setForm.durationPh': { bn: '৩০', en: '30' },
    'setForm.note': { bn: 'বিশেষ নির্দেশনা', en: 'Special Instructions' },
    'setForm.notePh': { bn: 'ঐচ্ছিক...', en: 'Optional...' },
    'setForm.cancel': { bn: 'বাতিল', en: 'Cancel' },
    'setForm.save': { bn: 'সংরক্ষণ করুন', en: 'Save' },

    // Toasts
    'toast.setCreated': { bn: 'প্রশ্নসেট তৈরি হয়েছে ✓', en: 'Question set created ✓' },
    'toast.setUpdated': { bn: 'আপডেট হয়েছে ✓', en: 'Updated ✓' },
    'toast.setDeleted': { bn: 'মুছে ফেলা হয়েছে', en: 'Deleted' },
    'toast.qAdded': { bn: 'প্রশ্ন যোগ হয়েছে ✓', en: 'Question added ✓' },
    'toast.qUpdated': { bn: 'প্রশ্ন আপডেট হয়েছে ✓', en: 'Question updated ✓' },
    'toast.qDeleted': { bn: 'প্রশ্ন মুছে ফেলা হয়েছে', en: 'Question deleted' },
    'toast.pdfDone': { bn: 'PDF ডাউনলোড হয়েছে ✓', en: 'PDF downloaded ✓' },
    'toast.pdfErr': { bn: 'PDF তৈরিতে সমস্যা হয়েছে', en: 'Failed to create PDF' },
    'toast.docxDone': { bn: 'Word ফাইল ডাউনলোড হয়েছে ✓', en: 'Word file downloaded ✓' },
    'toast.docxErr': { bn: 'Word ফাইল তৈরিতে সমস্যা হয়েছে', en: 'Failed to create Word file' },

    // Delete confirm
    'confirm.deleteSet.title': { bn: 'প্রশ্নসেট মুছে ফেলবেন?', en: 'Delete question set?' },
    'confirm.deleteSet.desc': { bn: 'এই প্রশ্নসেট এবং এর সকল প্রশ্ন স্থায়ীভাবে মুছে যাবে।', en: 'This question set and all its questions will be permanently deleted.' },
    'confirm.deleteSet.btn': { bn: 'মুছুন', en: 'Delete' },
    'confirm.deleteQ.title': { bn: 'প্রশ্ন মুছে ফেলবেন?', en: 'Delete question?' },
    'confirm.deleteQ.desc': { bn: 'এই প্রশ্নটি স্থায়ীভাবে মুছে যাবে।', en: 'This question will be permanently deleted.' },
    'confirm.deleteQ.btn': { bn: 'মুছুন', en: 'Delete' },
    'confirm.cancel': { bn: 'বাতিল', en: 'Cancel' },
    'confirm.confirm': { bn: 'নিশ্চিত করুন', en: 'Confirm' },

    // Editor
    'editor.notFound': { bn: 'প্রশ্নসেট পাওয়া যায়নি', en: 'Question set not found' },
    'editor.goBack': { bn: 'ড্যাশবোর্ডে যান', en: 'Go to Dashboard' },
    'editor.export': { bn: 'Export', en: 'Export' },
    'editor.pdfDownload': { bn: 'PDF ডাউনলোড', en: 'PDF Download' },
    'editor.wordDownload': { bn: 'Word (.docx)', en: 'Word (.docx)' },
    'editor.questionPaper': { bn: 'প্রশ্নপত্র', en: 'Question Paper' },
    'editor.total': { bn: (n: number) => `মোট ${n}টি`, en: (n: number) => `Total ${n}` },
    'editor.fullMarks': { bn: (n: number | string) => `পূর্ণমান: ${n}`, en: (n: number | string) => `Full Marks: ${n}` },
    'editor.emptyTitle': { bn: 'কোনো প্রশ্ন নেই', en: 'No questions yet' },
    'editor.emptyDesc': { bn: 'নিচের সবুজ বোতামে ট্যাপ করে প্রশ্ন যোগ করুন', en: 'Tap the green button below to add questions' },

    // Question types
    'qtype.srijonshil': { bn: 'সৃজনশীল', en: 'Creative' },
    'qtype.songkhipto': { bn: 'সংক্ষিপ্ত', en: 'Short' },
    'qtype.mcq': { bn: 'MCQ', en: 'MCQ' },

    // FAB - type selector
    'fab.selectType': { bn: 'প্রশ্নের ধরন বেছে নিন', en: 'Select Question Type' },
    'fab.srijonshilDesc': { bn: 'উদ্দীপক + ক/খ/গ/ঘ প্রশ্ন', en: 'Stimulus + ক/খ/গ/ঘ questions' },
    'fab.songkhiptoDesc': { bn: 'সংক্ষিপ্ত প্রশ্ন', en: 'Short question' },
    'fab.mcqDesc': { bn: '৪টি বিকল্পসহ প্রশ্ন', en: 'Question with 4 options' },
    'fab.addQ': { bn: 'প্রশ্ন যোগ করুন', en: 'Add question' },

    // Editors
    'edit.srijonshil.new': { bn: 'নতুন সৃজনশীল প্রশ্ন', en: 'New Creative Question' },
    'edit.songkhipto.new': { bn: 'নতুন সংক্ষিপ্ত প্রশ্ন', en: 'New Short Question' },
    'edit.mcq.new': { bn: 'নতুন MCQ প্রশ্ন', en: 'New MCQ Question' },
    'edit.srijonshil.edit': { bn: 'সৃজনশীল প্রশ্ন সম্পাদনা', en: 'Edit Creative Question' },
    'edit.songkhipto.edit': { bn: 'সংক্ষিপ্ত প্রশ্ন সম্পাদনা', en: 'Edit Short Question' },
    'edit.mcq.edit': { bn: 'MCQ প্রশ্ন সম্পাদনা', en: 'Edit MCQ Question' },

    // Srijonshil editor
    'srijonshil.uddipok': { bn: '📖 উদ্দীপক', en: '📖 Stimulus' },
    'srijonshil.uddipokOpt': { bn: '(ঐচ্ছিক)', en: '(Optional)' },
    'srijonshil.uddipokPh': { bn: 'উদ্দীপকের পাঠ্যাংশ এখানে লিখুন...', en: 'Write the stimulus text here...' },
    'srijonshil.qPh': { bn: 'প্রশ্ন লিখুন *', en: 'Write question *' },
    'srijonshil.qErr': { bn: 'প্রশ্ন লিখুন', en: 'Enter question' },
    'srijonshil.ko': { bn: 'জ্ঞানমূলক প্রশ্ন', en: 'Knowledge-based' },
    'srijonshil.koMarks': { bn: '১ নম্বর', en: '1 mark' },
    'srijonshil.kho': { bn: 'অনুধাবনমূলক প্রশ্ন', en: 'Comprehension' },
    'srijonshil.khoMarks': { bn: '২ নম্বর', en: '2 marks' },
    'srijonshil.go': { bn: 'প্রয়োগমূলক প্রশ্ন', en: 'Application' },
    'srijonshil.goMarks': { bn: '৩ নম্বর', en: '3 marks' },
    'srijonshil.gho': { bn: 'উচ্চতর দক্ষতামূলক প্রশ্ন', en: 'Higher Order' },
    'srijonshil.ghoMarks': { bn: '৪ নম্বর', en: '4 marks' },

    // Songkhipto editor
    'songkhipto.question': { bn: '❓ প্রশ্ন', en: '❓ Question' },
    'songkhipto.qPh': { bn: 'সংক্ষিপ্ত প্রশ্ন এখানে লিখুন...', en: 'Write short question here...' },
    'songkhipto.qErr': { bn: 'প্রশ্ন লিখুন', en: 'Enter question' },

    // MCQ editor
    'mcq.question': { bn: '❓ প্রশ্ন', en: '❓ Question' },
    'mcq.qPh': { bn: 'MCQ প্রশ্ন এখানে লিখুন...', en: 'Write MCQ question here...' },
    'mcq.qErr': { bn: 'প্রশ্ন লিখুন', en: 'Enter question' },
    'mcq.options': { bn: '🔘 বিকল্পসমূহ', en: '🔘 Options' },
    'mcq.optErr': { bn: 'বিকল্প লিখুন', en: 'Enter option' },
    'mcq.optPh': { bn: (lbl: string) => `${lbl} বিকল্প লিখুন`, en: (lbl: string) => `Write option ${lbl}` },

    // Question card
    'card.uddipok': { bn: 'উদ্দীপক', en: 'Stimulus' },

    // Export text
    'export.srijonshilSection': { bn: 'সৃজনশীল প্রশ্নাবলী (Creative Questions)', en: 'Creative Questions (সৃজনশীল প্রশ্নাবলী)' },
    'export.songkhiptoSection': { bn: 'সংক্ষিপ্ত প্রশ্নাবলী (Short Questions)', en: 'Short Questions (সংক্ষিপ্ত প্রশ্নাবলী)' },
    'export.mcqSection': { bn: 'বহুনির্বাচনী প্রশ্নাবলী (MCQ)', en: 'MCQ (বহুনির্বাচনী প্রশ্নাবলী)' },
    'export.headerTitle': { bn: 'বাংলা প্রশ্ন মেকার', en: 'QUESTION MAKER' },
    'export.class': { bn: (c: string) => `শ্রেণি: ${c}`, en: (c: string) => `Class: ${c}` },
    'export.subject': { bn: (s: string) => `বিষয়: ${s}`, en: (s: string) => `Subject: ${s}` },
    'export.fullMarks': { bn: (n: number | string) => `পূর্ণমান: ${n}`, en: (n: number | string) => `Full Marks: ${n}` },
    'export.duration': { bn: (n: number | string) => `সময়: ${n} মিনিট`, en: (n: number | string) => `Duration: ${n} min` },
    'export.note': { bn: (n: string) => `বিঃদ্রঃ ${n}`, en: (n: string) => `Note: ${n}` },
    'export.question': { bn: (n: number) => `প্রশ্ন ${n}`, en: (n: number) => `Question ${n}` },
    'export.uddipok': { bn: (t: string) => `উদ্দীপক: ${t}`, en: (t: string) => `Stimulus: ${t}` },

    // Dark mode / settings
    'settings.darkMode': { bn: 'ডার্ক মোড', en: 'Dark Mode' },
    'settings.language': { bn: 'ভাষা', en: 'Language' },
} as const;

type TransKey = keyof typeof translations;

export function useT() {
    const { lang } = useLangStore();
    return (key: TransKey, ...args: any[]): string => {
        const entry = translations[key];
        if (!entry) return key;
        const val = entry[lang];
        if (typeof val === 'function') return (val as any)(...args);
        return val as string;
    };
}

export function getT(lang: Lang) {
    return (key: TransKey, ...args: any[]): string => {
        const entry = translations[key];
        if (!entry) return key;
        const val = entry[lang];
        if (typeof val === 'function') return (val as any)(...args);
        return val as string;
    };
}
