import { Home, Watch, Cpu, Smartphone, Headphones, Laptop } from "lucide-react";

export const categories = [
  {
    id: 1,
    name: "لابتوبات",
    icon: Laptop,
    products: [
      {
        id: 1,
        mainImage: "/product.png",
        name: `Apple MacBook Air 13
شاشة 13.3 بوصة Retina
معالج Apple M1
ذاكرة 8 جيجابايت / تخزين 256 جيجابايت
كارت رسوميات 7-Core GPU`,
        rate: 4.6,
        price: 32499,
        mainPrice: 52499,
        discount: 20,
        isFavourite: true,
      },
      {
        id: 2,
        mainImage: "/product.png",
        name: `Apple MacBook Air 13
شاشة 13.3 بوصة Retina
معالج Apple M1
ذاكرة 8 جيجابايت / تخزين 512 جيجابايت
كارت رسوميات 8-Core GPU`,
        rate: 4.7,
        price: 36999,
        mainPrice: 55999,
        discount: 20,
        isFavourite: true,
      },
      {
        id: 3,
        mainImage: "/product.png",
        name: `Apple MacBook Air 13
شاشة 13.3 بوصة Retina
معالج Apple M1
ذاكرة 16 جيجابايت / تخزين 512 جيجابايت
كارت رسوميات 8-Core GPU`,
        rate: 4.8,
        price: 41999,
        mainPrice: 59999,
        discount: 20,
        isFavourite: false,
      },
      {
        id: 4,
        mainImage: "/product.png",
        name: `Apple MacBook Pro 14
شاشة Liquid Retina XDR
معالج Apple M1 Pro
ذاكرة 16 جيجابايت / تخزين 1TB
كارت رسوميات 14-Core GPU`,
        rate: 4.9,
        price: 69999,
        mainPrice: 79999,
        discount: 20,
        isFavourite: false,
      },
      {
        id: 5,
        mainImage: "/product.png",
        name: `Apple MacBook Air 13
شاشة 13.3 بوصة Retina
معالج Apple M1
ذاكرة 8 جيجابايت / تخزين 256 جيجابايت
كارت رسوميات 7-Core GPU`,
        rate: 4.4,
        price: 30999,
        mainPrice: 48999,
        discount: 20,
        isFavourite: false,
      },
    ],
  },

  {
    id: 2,
    name: "موبايلات",
    icon: Smartphone,
    products: [
      {
        id: 1,
        mainImage: "/product.png",
        name: `iPhone 14 Pro
شاشة 6.1 بوصة OLED
ذاكرة 128 جيجابايت
كاميرا 48 ميجابكسل`,
        rate: 4.7,
        price: 38999,
        mainPrice: 45999,
        discount: 20,
        isFavourite: false,
      },
      {
        id: 2,
        mainImage: "/product.png",
        name: `Samsung Galaxy S23
شاشة 6.1 بوصة AMOLED
ذاكرة 256 جيجابايت
Snapdragon 8 Gen 2`,
        rate: 4.6,
        price: 32999,
        mainPrice: 38999,
        discount: 20,
        isFavourite: true,
      },
    ],
  },

  {
    id: 3,
    name: "إلكترونيات",
    icon: Cpu,
    products: [
      {
        id: 1,
        mainImage: "/product.png",
        name: `معالج Intel Core i7
الجيل الثاني عشر
ذاكرة كاش 25MB
أداء عالي للألعاب`,
        rate: 4.5,
        price: 11999,
        mainPrice: 14999,
        discount: 20,
        isFavourite: false,
      },
    ],
  },

  {
    id: 4,
    name: "ساعات ذكية",
    icon: Watch,
    products: [
      {
        id: 1,
        mainImage: "/product.png",
        name: `Apple Watch Series 8
شاشة Retina
مقاومة للمياه
متابعة صحية كاملة`,
        rate: 4.6,
        price: 15999,
        mainPrice: 18999,
        discount: 20,
        isFavourite: true,
      },
    ],
  },

  {
    id: 5,
    name: "سماعات",
    icon: Headphones,
    products: [
      {
        id: 1,
        mainImage: "/product.png",
        name: `AirPods Pro
عزل ضوضاء نشط
شحن لاسلكي
جودة صوت عالية`,
        rate: 4.8,
        price: 8999,
        mainPrice: 10999,
        discount: 20,
        isFavourite: false,
      },
    ],
  },

  {
    id: 6,
    name: "أجهزة منزلية",
    icon: Home,
    products: [
      {
        id: 1,
        mainImage: "/product.png",
        name: `مكنسة كهربائية ذكية
قوة شفط عالية
فلتر HEPA
موفرة للطاقة`,
        rate: 4.3,
        price: 6499,
        mainPrice: 7999,
        discount: 20,
        isFavourite: true,
      },
    ],
  },
  {
    id: 7,
    name: "أجهزة منزلية",
    icon: Home,
    products: [
      {
        id: 2,
        mainImage: "/product.png",
        name: `مكنسة كهربائية ذكية
قوة شفط عالية
فلتر HEPA
موفرة للطاقة`,
        rate: 4.3,
        price: 6499,
        mainPrice: 7999,
        discount: 20,
        isFavourite: false,
      },
    ],
  },
];

export const products = [
  {
    id: 1,
    mainImage: "/product.png",
    name: `Apple MacBook Air 13
    شاشة 13.3 بوصة Retina
    معالج Apple M1
    ذاكرة 8 جيجابايت / تخزين 256 جيجابايت
    كارت رسوميات 7-Core GPU`,
    rate: 4.6,
    price: 32499,
    mainPrice: 52499,
    discount: 20,
    isFavourite: true,
    categoryId: 1,
    description: "وصف المنتج",
    quantity: 10,
    reviewCount: 100,
    images: ["/product.png", "/lap2.jpg", "/lap4.jpg", "/labtop.jpg"],
  },
  {
    id: 2,
    mainImage: "/product.png",
    name: `Apple MacBook Air 13
    شاشة 13.3 بوصة Retina
    معالج Apple M1
    ذاكرة 8 جيجابايت / تخزين 256 جيجابايت
    كارت رسوميات 7-Core GPU`,
    rate: 4.6,
    price: 32499,
    mainPrice: 52499,
    discount: 20,
    isFavourite: true,
    categoryId: 1,
    description: "وصف المنتج",
    quantity: 10,
    reviewCount: 100,
    images: ["/product.png", "/lap2.jpg", "/lap4.jpg", "/labtop.jpg"],
  },
  {
    id: 3,
    mainImage: "/product.png",
    name: `Apple MacBook Air 13
    شاشة 13.3 بوصة Retina
    معالج Apple M1
    ذاكرة 8 جيجابايت / تخزين 256 جيجابايت
    كارت رسوميات 7-Core GPU`,
    rate: 4.6,
    price: 32499,
    mainPrice: 52499,
    discount: 20,
    isFavourite: true,
    categoryId: 1,
    description: "وصف المنتج",
    quantity: 10,
    reviewCount: 100,
    images: ["/product.png", "/lap2.jpg", "/lap4.jpg", "/labtop.jpg"],
  },
  {
    id: 4,
    mainImage: "/product.png",
    name: `Apple MacBook Air 13
    شاشة 13.3 بوصة Retina
    معالج Apple M1
    ذاكرة 8 جيجابايت / تخزين 256 جيجابايت
    كارت رسوميات 7-Core GPU`,
    rate: 4.6,
    price: 32499,
    mainPrice: 52499,
    discount: 20,
    isFavourite: true,
    categoryId: 1,
    description: "وصف المنتج",
    quantity: 10,
    reviewCount: 100,
    images: ["/product.png", "/lap2.jpg", "/lap4.jpg", "/labtop.jpg"],
  },
  {
    id: 5,
    mainImage: "/product.png",
    name: `Apple MacBook Air 13
    شاشة 13.3 بوصة Retina
    معالج Apple M1
    ذاكرة 8 جيجابايت / تخزين 256 جيجابايت
    كارت رسوميات 7-Core GPU`,
    rate: 4.6,
    price: 32499,
    mainPrice: 52499,
    discount: 20,
    isFavourite: true,
    categoryId: 1,
    description: "وصف المنتج",
    quantity: 10,
    reviewCount: 100,
    images: ["/product.png", "/lap2.jpg", "/lap4.jpg", "/labtop.jpg"],
  },
];

export const product = {
  id: "ipad-pro-11-2020-wifi-128",
  image: "/labtop.jpg",
  images: ["/labtop.jpg", "/lap2.jpg", "/lap4.jpg", "/labtop.jpg"],
  isFavorite: false,

  title:
    'Apple iPad Pro 11" (2020) Wifi 128Gb (Silver) - 128Gb / 11Inch / Wifi',

  category: "الكترونيات",
  subCategory: "تابلت",

  price: 904.18,
  rate: 3.5,
  reviewsCount: 832,
  starsCount: {
    5: 750,
    4: 52,
    3: 24,
    2: 6,
    1: 0,
  },
  comments: [
    {
      id: 1,
      color: "اللون الذهبى",
      supplier: "تم شراؤه من قبل مورد 273",
      userName: "محمد مصطفى",
      userAvatar: "/person.jpg",
      rate: 5,
      date: "2026-01-20",
      comment:
        "شاشة اللمس مريحة على ويوضح عالي. استخدم غطاء قوي لحماية العلبة، وخدم دعم البطارية القابلة للكسر، وكان كلما زاد عدد الاستخدام زادت احتمالية رضى المستخدم اللمس مريحة على ويوضح عالي. استخدم غطاء قوي لحماية العلبة، وخدم دعم البطارية القابلة للكسر، وكان كلما زاد عدد الاستخدام زادت احتمالية رضى المستخدم اللمس مريحة على ويوضح عالي. استخدم غطاء قوي لحماية العلبة، وخدم دعم البطارية القابلة للكسر، وكان كلما زاد عدد الاستخدام زادت احتمالية رضى المستخدم.",
    },
    {
      id: 2,
      color: "اللون الذهبى",
      supplier: "تم شراؤه من قبل مورد 273",
      userName: "محمد مصطفى",
      userAvatar: "/person.jpg",
      rate: 5,
      date: "2026-01-20",
      comment:
        "شاشة  اللمس مريحة على ويوضح عالي. استخدم غطاء قوي لحماية العلبة، وخدم دعم البطارية القابلة للكسر، وكان كلما زاد عدد الاستخدام زادت احتمالية رضى المستخدم اللمس مريحة على ويوضح عالي. استخدم غطاء قوي لحماية العلبة، وخدم دعم البطارية القابلة للكسر.",
    },
    {
      id: 3,
      color: "اللون الذهبى",
      supplier: "تم شراؤه من قبل مورد 273",
      userName: "محمد مصطفى",
      userAvatar: "/person.jpg",
      rate: 4,
      date: "2026-01-20",
      comment:
        "منتج  اللمس مريحة على ويوضح عالي. استخدم غطاء قوي لحماية العلبة، وخدم دعم البطارية القابلة للكسر، وكان كلما زاد عدد الاستخدام زادت احتمالية رضى المستخدم ممتاز  اللمس مريحة على ويوضح عالي. استخدم غطاء قوي لحماية العلبة، وخدم دعم البطارية القابلة للكسر، وكان كلما زاد عدد الاستخدام زادت احتمالية رضى المستخدم مقابل السعر، لكن كنت أتمنى البطارية تكون أقوى شوية.",
    },
  ],

  shortSpecs: [
    "Desktop: LED-Backlit, 11Inch",
    "Chipset / CPU: Apple A12Z Bionic 2.3Ghz",
    "RAM: 6GB",
    "Operating System: iOS 13",
  ],

  colors: [
    { name: "Silver", code: "#C9C9C9" },
    { name: "Space Gray", code: "#8A8A8A" },
    { name: "Rose Gold", code: "#F1D6C8" },
    { name: "Yellow", code: "#F6E27A" },
  ],

  specs: {
    المنتج: "iPad",
    "الشركة المصنعة": "Apple",
    الموديل: 'iPad Pro 11" (2020) Wifi 128Gb',
    الشاشة: "LED-Backlit, 11 Inch",
    "دقة الشاشة": "2388 × 1668",
    المعالج: "Apple A12Z Bionic 2.3Ghz",
    "الذاكرة العشوائية": "6GB",
    "سعة التخزين": "128GB",
    "كرت الشاشة": "لا يوجد",
    الكاميرا: "خلفية 12MP / أمامية 7MP",
    الاتصال: "WiFi + Bluetooth 5.0",
    البصمة: "لا يوجد",
    "نظام التشغيل": "iOS 13",
    البطارية: "0 mAh",
    الوزن: "0.471 كجم",
    الأبعاد: "24.7 × 17.8 × 0.59 سم",
    اللون: "فضي",
    المنفذ: "USB Type C",
    "محتويات العلبة": "شاحن 18W، كابل Type-C بطول 1 متر، دليل الاستخدام",
    الأمان: "Face ID",
  },

  desc: `
<h1>تصميم رفيع وخفيف، بسماكة 5.9 مم، وحواف دائرية ناعمة، ولون فضي أنيق.</h1>
<p>يتميز جهاز آيباد برو 11 بوصة (إصدار 2020) من آبل، بسعة تخزين 128 جيجابايت وواي فاي (لون فضي) بنفس تصميم سابقه مع بعض التغييرات الطفيفة، مثل وضع نظام الكاميرا الخلفية بشكل مربع، وزيادة الكثافة التي تبلغ 471 غيغابايت فقط، بأبعاد الباقة 247.6 × 178.5 ملم وشكله الذي لا يتجاوز 5.9 ملم. يوفر آيباد برو 11 إصدار 2020 قابل للفتح والتحقق مما يجعله سهل الحمل والاستخدام أثناء التنقل.</p>
<p>توفر الحواف الدائرية الناعمة إحساسًا مريحًا ومتينًا عند الإمساك به، مما يكفي لتلقفها على التصميم. يتوفر آيباد برو 11 بوصة (إصدار 2020) بلون فضي أنيق وراقي.</p>
<h1>شاشة بتردد 120 هرتز، و16 مليون لون، ولوحة IPS LCD مقاس 11 بوصة</h1>
<p>يتيح استخدام شاشة بتردد 120 هرتز لجهاز iPad Pro عرض صور فائقة الوضوح وسرعة معالجة صور عالية، كما تعزز هذه الشاشة حساسية اللمس مما يساعد على تسجيل حركات التمرير والاستجابة السريعة، وبالتالي سيحب المستخدمون تجربة الاستخدام أفضل مع عمليات سريعة الاستجابة وتجنب أي تشويش أو تأخير في عرض الصور.</p>
<p>يزود جهاز iPad برو 11 (إصدار 2020) بشاشة IPS LCD تدعم 16 مليون لون بدقة 1668 × 2388 بكسل، وحجم 11 بوصة، مما يساعِد على عرض الألوان وإضافة الحياة على بُعدين عميقين، بالإضافة إلى دعم تقنيات الشاشة مثل True Tone وProMotion. كما توفر الشاشة استخدامًا رائعًا لأجهزة iPad Pro 2020 (إصدار 2020) فقط بفضل مقاومة اللمس التي تساعد على منع انعكاس الضوء، بالإضافة إلى الفعالية عند الاستخدام في الهواء الطلق.</p>
<h1>تجربة مثالية</h1>
<p>كل ما ستستمتع به مع جهاز 10.2 iPad (2019) بوصة واي فاي + خلوي، بسعة 32 جيجابايت، طراز MW6D2ZA / A (ذهبي)، يتميز بصورة وصوت أفضل بفضل شاشة Retina مقاس 10.2 بوصة ونظام الصوت الستيريو. مع Apple TV ستتمكن من الوصول إلى خدمات البث الشهيرة والاستمتاع بأحدث المسلسلات والأفلام.</p>
<h1>أداء فِقير عند امتلاك شريحة A12Z Bionic</h1>
<p>على جانب التصميم والشاشة، تؤدي آيباد 2020 iPad Pro إلى أداء قوي ومتميز بفضل معالج A12Z Bionic ثماني النواة الذي يضمن أداءً عالي الكفاءة عند تبديل الحرارة. كما أن تحسين نظام التحكم الجديد يعزز أداء الجهاز، وسيتحقق من التحسينات. سيستمر iPad Pro 11 2020 في دعم دقة الفيديو بدقة 4K، بالإضافة إلى قدرات الأداء السلسة في جميع احتياجات الاستخدام.</p>
<p>تتيح لك الذاكرة الداخلية بسعة 128 جيجابايت تخزين الصور والفيديوهات والتطبيقات وغيرها بسهولة، بالإضافة إلى النسخة القياسية بسعة 128 جيجابايت، ويوفر iPad Pro 2020 11 iPad Pro 2020 iPad Pro 256 جيجابايت.</p>
<h1>نظام كاميرا خلفية مُتعدد بمقياس عمق LiDAR</h1>
<p>على عكس أجهزة iPad Pro السابقة، يتميز iPad Pro 11 (إصدار 2020) بنظام كاميرا مُتعدد بشكل كبير، حيث يضم كاميرتين خلفيتين مزدوجتين، بالإضافة إلى كاميرا ثالثة ذات مقياس LiDAR للحصول على تجربة احترافية، يفضل الكاميرا الرئيسية بدقة 12 ميجابكسل والكاميرا الثانية بدقة 10 ميجابكسل. يستخدم ماسح LiDAR لمساعدة جهازك على قياس المسافات حول الجسم، سواء في الأماكن الداخلية أو المفتوحة. يفضل لذلك إنشاء صور ثلاثية الأبعاد يمكن تسجيل أي صورة وتعديلها وتحويل مقاطع الفيديو بدقة 4K بشكل أفضل.</p>
<p>بالإضافة إلى ذلك، يتم تجهيز iPad Pro 11 (إصدار 2020) بكاميرات أمامية بدقة 7 ميجابكسل تدعم فيديو بدقة 1080p، مما يتيح لك إجراء مكالمات فيديو عالية الجودة والتقاط صور سيلفي رائعة، أو حتى استخدام كاميرا الجهاز لمتابعة مدونات فيديو ومشاركتها مع الأصدقاء.</p>
`,
};

export const categoriesText = [
  "عقارات",
  "إلكترونيات",
  "ملابس",
  "أحذية",
  "ساعات",
  "موبايلات",
  "أجهزة منزلية",
  "أثاث",
];

export const subCategories = [
  "كيبورد",
  "كاميرا",
  "ماوس",
  "سماعة",
  "هارد",
  "كابلات",
  "وصلات انترنت",
  "USB",
];
