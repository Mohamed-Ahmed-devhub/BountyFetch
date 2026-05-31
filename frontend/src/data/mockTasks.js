export const MOCK_TASKS = [
  { id:'t1',  title:'تعديل CSS Responsive لموقع WordPress', description:'الموقع يعمل على الديسكتوب لكن على الموبايل النصوص تتداخل. أحتاج إصلاح عاجل.', skills:['CSS','WordPress','Responsive'], budget:'$30-$60',    source:'telegram',   domain:'web',      postedAt:'منذ 2 دقيقة' },
  { id:'t2',  title:'React Dashboard with Recharts',         description:'Need a clean analytics dashboard with 3 chart types, responsive with Tailwind.', skills:['React','JavaScript','Tailwind CSS'], budget:'$80-$150',  source:'reddit',     domain:'web',      postedAt:'5 minutes ago' },
  { id:'t3',  title:'Landing Page من تصميم Figma',           description:'عندي تصميم Figma كامل، أحتاج تحويله لكود HTML/CSS نظيف 100% متجاوب.',         skills:['HTML','CSS','Figma'],              budget:'$50-$90',    source:'facebook',   domain:'web',      postedAt:'منذ 8 دقائق' },
  { id:'t4',  title:'Fix z-index bug in navigation',         description:'Dropdown menu goes behind hero section on mobile. Quick fix needed.',            skills:['CSS','JavaScript'],                budget:'$15-$25',    source:'twitter',    domain:'web',      postedAt:'12 minutes ago' },
  { id:'t5',  title:'بناء متجر Shopify مخصص',               description:'أحتاج شخص خبير في Shopify لبناء متجر إلكتروني كامل مع سلة مشتريات.',          skills:['Shopify','JavaScript','CSS'],      budget:'$200-$400',  source:'mostaql',    domain:'web',      postedAt:'منذ 15 دقيقة' },
  { id:'t6',  title:'Flutter food delivery app',             description:'Looking for Flutter developer to build a food delivery app with Firebase.',      skills:['Flutter','Firebase'],             budget:'$500-$1000', source:'linkedin',   domain:'mobile',   postedAt:'20 minutes ago' },
  { id:'t7',  title:'React Native iOS crash fix',            description:'Our React Native app crashes on iOS 17. Need experienced developer urgently.',   skills:['React Native','JavaScript'],      budget:'$100-$200',  source:'upwork',     domain:'mobile',   postedAt:'25 minutes ago' },
  { id:'t8',  title:'Python data scraping script',           description:'Need a Python script to scrape product data from 3 websites and export CSV.',    skills:['Python','Data Science'],          budget:'$60-$120',   source:'reddit',     domain:'ai',       postedAt:'30 minutes ago' },
  { id:'t9',  title:'ChatGPT API integration Node.js',       description:'Add AI chat feature to existing Node.js app with streaming responses.',          skills:['Node.js','JavaScript'],           budget:'$80-$150',   source:'freelancer', domain:'ai',       postedAt:'35 minutes ago' },
  { id:'t10', title:'Web app security audit',                description:'Need penetration testing for SaaS app. Looking for certified ethical hacker.',   skills:['Cybersecurity'],                  budget:'$300-$600',  source:'linkedin',   domain:'security', postedAt:'40 minutes ago' },
  { id:'t11', title:'Unity 2D physics bug fix',              description:'Our Unity 2D platformer has physics glitches on certain levels.',                 skills:['Game Development'],               budget:'$80-$150',   source:'reddit',     domain:'games',    postedAt:'45 minutes ago' },
  { id:'t12', title:'Vue.js component library setup',        description:'Need Vue 3 component library with Storybook and proper TypeScript types.',       skills:['Vue.js','TypeScript'],            budget:'$120-$200',  source:'upwork',     domain:'web',      postedAt:'50 minutes ago' },
  { id:'t13', title:'تصميم موقع شركة محاماة',               description:'شركة محاماة تحتاج موقع احترافي 5 صفحات مع نظام حجز استشارات.',                 skills:['WordPress','CSS','HTML'],         budget:'$150-$300',  source:'khamsat',    domain:'web',      postedAt:'منذ ساعة' },
  { id:'t14', title:'Next.js performance optimization',      description:'Next.js app has slow page load. Need Core Web Vitals optimization to 90+.',      skills:['Next.js','JavaScript'],           budget:'$100-$180',  source:'twitter',    domain:'web',      postedAt:'1 hour ago' },
  { id:'t15', title:'إصلاح خطأ CORS في Laravel',            description:'الـ API ترفع خطأ CORS عند الاتصال من الـ Frontend. أحتاج حل سريع.',             skills:['Laravel','PHP'],                  budget:'$20-$40',    source:'telegram',   domain:'web',      postedAt:'منذ ساعة' },
]

export const SOURCE_CONFIG = {
  telegram:   { color:'#0088CC', bg:'#E8F4FD', label:'Telegram',   emoji:'✈️' },
  reddit:     { color:'#FF4500', bg:'#FFF1EC', label:'Reddit',     emoji:'🔴' },
  twitter:    { color:'#1DA1F2', bg:'#E8F5FE', label:'Twitter/X',  emoji:'🐦' },
  facebook:   { color:'#1877F2', bg:'#E8F0FE', label:'Facebook',   emoji:'👥' },
  linkedin:   { color:'#0A66C2', bg:'#E8F0FA', label:'LinkedIn',   emoji:'💼' },
  upwork:     { color:'#14A800', bg:'#E8F8E8', label:'Upwork',     emoji:'💚' },
  freelancer: { color:'#29B2FE', bg:'#E8F5FE', label:'Freelancer', emoji:'🔵' },
  khamsat:    { color:'#E8B84B', bg:'#FDF8E8', label:'خمسات',      emoji:'⭐' },
  mostaql:    { color:'#FF6B35', bg:'#FFF0EB', label:'مستقل',      emoji:'🧡' },
  rss:        { color:'#6B7280', bg:'#F4F6F9', label:'Sites',      emoji:'📡' },
}

export const DOMAINS = [
  { id:'all',      ar:'الكل',          en:'All',           icon:'🌐' },
  { id:'web',      ar:'الويب',         en:'Web Dev',       icon:'🖥️' },
  { id:'mobile',   ar:'موبايل',        en:'Mobile',        icon:'📱' },
  { id:'ai',       ar:'ذكاء اصطناعي', en:'AI & Data',     icon:'🤖' },
  { id:'security', ar:'أمن سيبراني',  en:'Cybersecurity', icon:'🔐' },
  { id:'games',    ar:'ألعاب',         en:'Game Dev',      icon:'🎮' },
]

export const SOURCES = [
  { id:'all',        ar:'الكل',      en:'All' },
  { id:'telegram',   ar:'تيليجرام', en:'Telegram' },
  { id:'reddit',     ar:'ريديت',    en:'Reddit' },
  { id:'twitter',    ar:'تويتر',    en:'Twitter' },
  { id:'facebook',   ar:'فيسبوك',  en:'Facebook' },
  { id:'linkedin',   ar:'لينكدإن', en:'LinkedIn' },
  { id:'upwork',     ar:'أبورك',   en:'Upwork' },
  { id:'mostaql',    ar:'مستقل',   en:'Mostaql' },
]
