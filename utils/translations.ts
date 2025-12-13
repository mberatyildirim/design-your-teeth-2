// Simple translation system
export type Language = 'en' | 'bg';

export const translations = {
  en: {
    camera: {
      capture: "📷 Capture",
      cancel: "✕ Cancel"
    },
    nav: {
      howItWorks: "How it Works",
      realStories: "Real Stories",
      features: "Features",
      contact: "Contact Us",
      tryFree: "Try It Free Now",
      designMode: "Design Mode"
    },
    hero: {
      badge: "#1 AI Smile Designer",
      titleStart: "Design Your",
      titleEnd: "Dream Smile %100 Free",
      subtitle: "Visualize your perfect smile instantly with our revolutionary AI. Upload a photo and see the magic happen in seconds.",
      cta: "Try It Free Now",
      freeTool: "100% Free Tool",
      noSignUp: "No Sign Up Required"
    },
    quickGen: {
      title: "See Your New Smile Instantly",
      subtitle: "Upload a photo and get your AI-designed smile in seconds. No complex steps.",
      uploadTitle: "Upload Your Photo",
      uploadDesc: "Selfie or close-up. Make sure teeth are visible.",
      uploadBtn: "Upload Photo",
      cameraBtn: "Take Photo",
      instantCamera: "Instant Camera",
      analyzing: "Analyzing your smile...",
      generating: "Generating your new look...",
      resultTitle: "Your New Smile",
      download: "Download",
      tryAgain: "Try Another Photo",
      tapToEnlarge: "Tap image to enlarge",
      aiMagic: "AI Instant Magic",
      formTitle: "Get Your Result",
      formDesc: "Enter your details to see your transformation",
      namePlaceholder: "Full Name",
      phonePlaceholder: "Phone Number",
      freeTreatment: "Would you like to get your free treatment plan?",
      continue: "Continue",
      terms: "By continuing, you agree to our ",
      termsLink: "Terms & Privacy Policy"
    },
    customDesign: {
        premium: "Premium Feature",
        title: "Want More Control?",
        subtitle: "Design every detail of your smile with our advanced customization tool.",
        feature1: "Choose Tooth Shape",
        feature2: "Select Exact Shade",
        feature3: "Adjust Brightness",
        cta: "Start Custom Design"
    },
    howItWorks: {
      title: "How It Works",
      step1Title: "Upload Photo",
      step1Desc: "Take a selfie or upload a clear photo. AI analyzes it in seconds.",
      step2Title: "AI Analysis",
      step2Desc: "Our advanced tech maps your facial structure and designs the perfect smile.",
      step3Title: "Instant Result",
      step3Desc: "See your transformation immediately. Compare before & after in high-res."
    },
    stories: {
      title: "Real Stories",
      subtitle: "See what our community is saying about their new smiles."
    },
    results: {
      title: "Real Results",
      subtitle: "See the amazing transformations from our community"
    },
    benefits: {
      instant: "Instant",
      instantDesc: "< 30 Seconds",
      aiPowered: "AI-Powered",
      aiDesc: "99% Accuracy",
      mobileReady: "Mobile Ready",
      mobileDesc: "Works everywhere",
      free: "100% Free",
      freeDesc: "No Credit Card"
    },
    video: {
      title: "Transform Your Smile",
      subtitle: "In Seconds",
      desc: "Watch how our AI technology creates your perfect smile in real-time",
      cta: "Get Started",
      badge: "AI-Powered Smile Design",
      stats: {
        users: "Users",
        smiles: "Smiles",
        satisfaction: "Satisfaction"
      }
    },
    faq: {
      title: "FAQ",
      q1: "How does the AI smile design work?",
      a1: "Our advanced AI technology analyzes your facial structure and teeth from your uploaded photo. It then applies your selected aesthetic style and shade to create a realistic preview of your transformed smile. The entire process takes less than a minute.",
      q2: "Is the service really free?",
      a2: "Yes, absolutely! Design Your Teeth is 100% free to use. There are no hidden fees, no credit card required, and no sign-up necessary. Simply upload your photo and see your transformation instantly.",
      q3: "How accurate are the results?",
      a3: "Our AI technology has been trained on thousands of dental transformations and achieves 99% accuracy in smile design. However, please note that these are visual simulations for cosmetic purposes only and do not constitute medical advice.",
      q4: "Can I use the result image with my dentist?",
      a4: "Absolutely! Many users download their result images to discuss with their dentist. The preview helps you communicate your desired aesthetic goals more effectively during consultations.",
      q5: "What photo quality do I need?",
      a5: "For best results, use a clear, well-lit photo where your teeth are visible. A selfie or close-up photo works perfectly. Make sure your face is centered and the photo is in focus.",
      q6: "Is my data secure?",
      a6: "Yes, we take your privacy seriously. Your uploaded photos are processed securely and are not shared with third parties. All data is encrypted and stored according to industry-standard security practices."
    },
    cta: {
      title: "Ready to Transform?",
      subtitle: "Join 10,000+ happy smiles. It takes less than a minute and it's completely free.",
      button: "Try It Free Now"
    },
    footer: {
      explore: "Explore",
      legal: "Legal & Support",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      rights: "© 2025 Design Your Teeth. All rights reserved.",
      desc: "Transform your smile with our advanced dental technology and expert care."
    },
    smileApp: {
      step1: {
        title: "Choose your aesthetics"
      },
      step2: {
        title: "Select your shade",
        subtitle: "From natural brightness to Hollywood perfection.",
        back: "Back"
      },
      step3: {
        title: "Upload Your Photo",
        subtitle: "Selfie or close-up. Make sure teeth are visible. Photo will be cropped to square.",
        upload: "Upload",
        gallery: "From Gallery",
        camera: "Camera",
        takePhoto: "Take Photo",
        processing: "Processing...",
        almostDone: "Almost done...",
        back: "Back"
      },
      step4: {
        title: "Creating Your Perfect Smile",
        subtitle: "Our AI is analyzing your photo and applying your selected aesthetic...",
        photoAnalyzed: "Photo Analyzed",
        structureDetected: "Facial structure detected",
        aiProcessing: "AI Processing",
        applyingStyle: "Applying style...",
        finalizing: "Finalizing",
        almostReady: "Almost ready...",
        timeEstimate: "This usually takes 30-60 seconds"
      },
      step5: {
        title: "Get Your Results",
        subtitle: "Enter your details to access your transformation",
        namePlaceholder: "Full Name",
        phonePlaceholder: "Phone Number",
        freeTreatment: "Would you like to get your free treatment plan?",
        continue: "Continue",
        resultTitle: "Your Future Smile",
        resultSubtitle: "Based on selected aesthetics",
        style: "Style",
        shade: "Shade",
        color: "Color",
        download: "Download",
        designAnother: "Design Another Smile",
        tapToEnlarge: "Tap image to enlarge",
        termsPrefix: "By continuing, you agree to our ",
        termsText: "Terms",
        privacyText: "Privacy Policy"
      },
      styles: {
        natural: "Natural",
        hollywood: "Hollywood",
        oval: "Oval",
        dominant: "Dominant"
      },
      shades: {
        bl1: "Extra White (BL1)",
        bl3: "Bright White (BL3)",
        a1: "Natural (A1)"
      }
    },
    contact: {
      title: "Contact Us",
      desc: "We are here to help you achieve your perfect smile. Our support team is available Monday through Friday, 9am to 6pm EST.",
      getInTouch: "Get in Touch",
      email: "Email",
      phone: "Phone",
      back: "Back to Home"
    },
    privacy: {
      title: "Privacy Policy",
      date: "Effective Date: January 1, 2025",
      intro: "Information Note on the Protection of Personal Data\nInformation Text on the Processing of Personal Data\nDENTAŞ AĞIZ VE DİŞ SAĞLIĞI LTD. ŞTİ., (DENTAŞ) as businesses within its affiliated subsidiaries, we attach great importance to the security of your personal data. In accordance with the Personal Data Protection Law No. 6698 (\"Personal Data Law\") and the \"Regulation on the Processing and Privacy of Personal Health Data\", as a healthcare institution, we inform you that we will record, archive, share your personal information required to provide you with healthcare services with authorized 3rd Parties/Institutions when necessary, and process it in the ways listed in the Personal Data Law. Therefore, we inform you about our mutual rights and obligations.",
      section1Title: "1. Processing of Your Personal Data and Data Controller",
      section1Content: [
        "In order to provide you with healthcare services as a data controller as DENTAŞ;",
        "Your contact information (Address, phone number, e-mail address, etc.)",
        "We inform you that we will record your personal information, including your IP address, browser information, navigation data obtained during use, and medical data you voluntarily transmit via the mobile application, obtained during the use of our website and mobile applications, and process them in our archives subject to the conditions and in the manner foreseen in the Personal Data Law in any case.",
        "Your pre-treatment or post-treatment images generated by the application uploaded via the mobile application are in no way processed or stored by us."
      ],
      section2Title: "2. Purpose and Legal Reason for Processing Your Personal Data",
      section2Intro: "Among the purposes of processing your personal data are;",
      section2Content: [
        "Protection of public health, execution of medical diagnosis, treatment and care services,",
        "Sharing requested information with the Ministry of Health and other public institutions and organizations in accordance with relevant legislation,",
        "Providing you with information regarding your appointment if you make an appointment,",
        "Planning and managing Dentaş's internal functioning,",
        "Conducting analysis to improve health services,",
        "For the purpose of fulfilling activities in the fields of education / training institutions with which we cooperate,",
        "Financing of health services, invoicing,",
        "Verification of your identity, verification and confirmation of your relationship with contracted / relevant institutions,",
        "Responding to your questions or complaints regarding our services,",
        "Activities related to measuring and researching patient satisfaction in order to increase service quality,",
        "Supply of drugs and medical devices,",
        "Participation in campaigns and providing campaign information by Marketing, Media and Communication, Call Center departments, designing and transmitting special content, tangible and intangible benefits on Web and mobile channels.",
        "The legal reasons for the processing of your personal data are; fulfillment of our legal obligations arising from the relevant secondary legislation such as the Decree Law on the Organization and Duties of the Ministry of Health and its Affiliated Institutions No. 663, Private Hospitals Regulation, Health Implementation Communiqué, Patient Rights Regulation, and the cases clearly foreseen in the Private Hospitals Law No. 2219 and the Basic Law on Health Services No. 3359, and protection of public health, preventive medicine, medical diagnosis, treatment and care services, planning and management of health services and financing."
      ],
      section3Title: "3. Transfer of Your Personal Data",
      section3Content: "For the purposes of public health and preventive medicine services and subject to the conditions in the Personal Data Protection Law,\nIn case of request by authorized authorities including but not limited to the TR Ministry of Health and Provincial Health Directorates, Public Health Centers and other units affiliated to the Ministry of Health, or by persons assigned by authorized authorities or within the scope of established e-pulse and similar systems, or within the scope of our notification and/or reporting obligation imposed on us, your personal data may be shared with the relevant authorities and persons,\nOur direct/indirect domestic/foreign shareholders, subsidiaries and/or affiliates, group companies,\nWith our business partners,\nWith lawyers, consultants, auditors we work with, legal representatives and third parties we receive consultancy from and authorize,\nWith domestic/foreign organizations and other third parties and their legal representatives from whom we receive contractual services and cooperate to carry out our activities,\nWith the Social Security Institution for patients under SSI coverage, with your insurance company if you use your private insurance, with your institution if your invoicing is to be made to the institution you work for,\nWith laboratories, ambulances, medical device and health service providers in Turkey or abroad with whom we cooperate for medical diagnosis and treatment,\nWith the relevant health institution when you need to be referred,\nGeneral Directorate of Security and other law enforcement forces,\nGeneral Directorate of Population and Citizenship Affairs,\nTurkish Pharmacists Association,\nWith legal representatives you have authorized."
    },
    terms: {
      title: "Terms of Service",
      date: "Last Updated: January 1, 2025",
      intro: "Please read these Terms of Service (\"Terms\") carefully before using the Design Your Teeth website and services operated by Design Your Teeth Inc.",
      section1Title: "1. Acceptance of Terms",
      section1Content: "By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. These terms are governed by the Personal Data Protection Law No. 6698 and relevant healthcare regulations.",
      section2Title: "2. Medical Disclaimer",
      section2Content: "Important: The visualizations provided by Design Your Teeth are for cosmetic simulation purposes only and do not constitute medical or dental advice, diagnosis, or treatment planning. Always seek the advice of your dentist or other qualified health provider with any questions you may have regarding a dental condition.",
      section3Title: "3. User Responsibilities & Data Usage",
      section3Intro: "You represent and warrant that:",
      section3Content: [
        "You have the legal right to upload the images you submit.",
        "You acknowledge that your data will be processed in accordance with our Privacy Policy and the Personal Data Protection Law No. 6698.",
        "Your pre-treatment or post-treatment images generated by the application are not stored by us, as detailed in our Privacy Policy.",
        "You will not use the service for any illegal or unauthorized purpose."
      ],
      section4Title: "4. Intellectual Property",
      section4Content: "The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Design Your Teeth Inc. and its licensors.",
      section5Title: "5. Limitation of Liability",
      section5Content: "In no event shall Design Your Teeth, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service."
    }
  },
  bg: {
    camera: {
      capture: "📷 Снимай",
      cancel: "✕ Отказ"
    },
    nav: {
      howItWorks: "Как работи",
      realStories: "Истории",
      features: "Функции",
      contact: "Контакт",
      tryFree: "Пробвай безплатно",
      designMode: "Дизайн режим"
    },
    hero: {
      badge: "#1 AI Дизайнер на усмивки",
      titleStart: "Създай своята",
      titleEnd: "мечтана усмивка безплатно",
      subtitle: "Визуализирайте перфектната си усмивка мигновено с нашия революционен AI. Качете снимка и вижте магията за секунди.",
      cta: "Пробвай безплатно сега",
      freeTool: "100% Безплатен инструмент",
      noSignUp: "Без регистрация"
    },
    quickGen: {
      title: "Виж новата си усмивка веднага",
      subtitle: "Качете снимка и получете своята AI-дизайнерска усмивка за секунди. Без сложни стъпки.",
      uploadTitle: "Качете вашата снимка",
      uploadDesc: "Селфи или близък план. Уверете се, че зъбите се виждат.",
      uploadBtn: "Качи снимка",
      cameraBtn: "Снимай сега",
      instantCamera: "Моментална камера",
      analyzing: "Анализиране на усмивката...",
      generating: "Генериране на новата визия...",
      resultTitle: "Твоята нова усмивка",
      download: "Изтегли",
      tryAgain: "Пробвай друга снимка",
      tapToEnlarge: "Натисни за уголемяване",
      aiMagic: "AI Моментална магия",
      formTitle: "Виж резултата",
      formDesc: "Въведете детайлите си, за да видите трансформацията",
      namePlaceholder: "Име и Фамилия",
      phonePlaceholder: "Телефонен номер",
      freeTreatment: "Искате ли да получите безплатен план за лечение?",
      continue: "Продължи",
      terms: "Продължавайки, се съгласявате с нашите ",
      termsLink: "Условия и Политика за поверителност"
    },
    customDesign: {
        premium: "Премиум функция",
        title: "Искате повече контрол?",
        subtitle: "Проектирайте всеки детайл от усмивката си с нашия усъвършенстван инструмент за персонализиране.",
        feature1: "Избери форма на зъбите",
        feature2: "Избери точен нюанс",
        feature3: "Регулирай яркостта",
        cta: "Започни персонализиран дизайн"
    },
    howItWorks: {
      title: "Как работи",
      step1Title: "Качи снимка",
      step1Desc: "Направете селфи или качете ясна снимка. AI я анализира за секунди.",
      step2Title: "AI Анализ",
      step2Desc: "Нащата технология картографира лицевата структура и проектира перфектната усмивка.",
      step3Title: "Мигновен резултат",
      step3Desc: "Вижте трансформацията веднага. Сравнете преди и след с високо качество."
    },
    stories: {
      title: "Истински истории",
      subtitle: "Вижте какво казва нашата общност за новите си усмивки."
    },
    results: {
      title: "Реални резултати",
      subtitle: "Вижте невероятните трансформации от нашата общност"
    },
    benefits: {
      instant: "Мигновено",
      instantDesc: "< 30 Секунди",
      aiPowered: "AI-Задвижвано",
      aiDesc: "99% Точност",
      mobileReady: "Мобилно",
      mobileDesc: "Работи навсякъде",
      free: "100% Безплатно",
      freeDesc: "Без кредитна карта"
    },
    video: {
      title: "Трансформирай усмивката си",
      subtitle: "За секунди",
      desc: "Вижте как нашата AI технология създава перфектната ви усмивка в реално време",
      cta: "Започни сега",
      badge: "AI-Задвижван Дизайн",
      stats: {
        users: "Потребители",
        smiles: "Усмивки",
        satisfaction: "Удовлетвореност"
      }
    },
    faq: {
      title: "Често задавани въпроси",
      q1: "Как работи AI дизайнът на усмивката?",
      a1: "Нашата напреднала AI технология анализира лицевата структура и зъбите откачената снимка. След това прилага избрания естетичен стил и нюанс, за да създаде реалистична визуализация. Целият процес отнема по-малко от минута.",
      q2: "Услугата наистина ли е безплатна?",
      a2: "Да, абсолютно! Design Your Teeth е 100% безплатен за ползване. Няма скрити такси, не се изисква кредитна карта и няма нужда от регистрация.",
      q3: "Колко точни са резултатите?",
      a3: "Нашата технология е обучена върху хиляди дентални трансформации и постига 99% точност. Все пак, имайте предвид, че това са визуални симулации за козметични цели и не представляват медицински съвет.",
      q4: "Мога ли да използвам резултата при зъболекаря си?",
      a4: "Разбира се! Много потребители изтеглят резултатите си, за да ги обсъдят със своя зъболекар. Визуализацията помага да комуникирате по-ефективно желаните естетични цели.",
      q5: "Какво качество на снимката е нужно?",
      a5: "За най-добри резултати използвайте ясна, добре осветена снимка, на която зъбите се виждат. Селфи или близък план вършат идеална работа.",
      q6: "Сигурни ли са данните ми?",
      a6: "Да, ние приемаме поверителността ви сериозно. Качените снимки се обработват сигурно и не се споделят с трети страни. Всички данни са криптирани."
    },
    cta: {
      title: "Готови ли сте за промяна?",
      subtitle: "Присъединете се към 10,000+ щастливи усмивки. Отнема по-малко от минута и е напълно безплатно.",
      button: "Пробвай безплатно сега"
    },
    footer: {
      explore: "Разгледай",
      legal: "Правна информация",
      privacy: "Политика за поверителност",
      terms: "Условия за ползване",
      rights: "© 2025 Design Your Teeth. Всички права запазени.",
      desc: "Трансформирайте усмивката си с нашата модерна дентална технология и експертна грижа."
    },
    smileApp: {
      step1: {
        title: "Избери своята естетика"
      },
      step2: {
        title: "Избери нюанс",
        subtitle: "От естествена белота до Холивудско съвършенство.",
        back: "Назад"
      },
      step3: {
        title: "Качи твоята снимка",
        subtitle: "Селфи или близък план. Уверете се, че зъбите се виждат. Снимката ще бъде изрязана.",
        upload: "Качи",
        gallery: "От Галерия",
        camera: "Камера",
        takePhoto: "Снимай",
        processing: "Обработка...",
        almostDone: "Почти готово...",
        back: "Назад"
      },
      step4: {
        title: "Създаване на перфектната усмивка",
        subtitle: "Нашият AI анализира снимката и прилага избраната естетика...",
        photoAnalyzed: "Снимката е анализирана",
        structureDetected: "Лицевата структура е засечена",
        aiProcessing: "AI Обработка",
        applyingStyle: "Прилагане на стил...",
        finalizing: "Финализиране",
        almostReady: "Почти готово...",
        timeEstimate: "Обикновено отнема 30-60 секунди"
      },
      step5: {
        title: "Виж резултатите",
        subtitle: "Въведете детайлите си, за да видите трансформацията",
        namePlaceholder: "Име и Фамилия",
        phonePlaceholder: "Телефонен номер",
        freeTreatment: "Искате ли да получите безплатен план за лечение?",
        continue: "Продължи",
        resultTitle: "Твоята бъдеща усмивка",
        resultSubtitle: "Базирано на избраната естетика",
        style: "Стил",
        shade: "Нюанс",
        color: "Цвят",
        download: "Изтегли",
        designAnother: "Дизайн на нова усмивка",
        tapToEnlarge: "Натисни за уголемяване",
        termsPrefix: "Продължавайки, се съгласявате с нашите ",
        termsText: "Условия",
        privacyText: "Политика за поверителност"
      },
      styles: {
        natural: "Естествен",
        hollywood: "Холивуд",
        oval: "Овален",
        dominant: "Доминантен"
      },
      shades: {
        bl1: "Екстра Бяло (BL1)",
        bl3: "Ярко Бяло (BL3)",
        a1: "Естествено (A1)"
      }
    },
    contact: {
      title: "Контакт с нас",
      desc: "Ние сме тук, за да ви помогнем да постигнете перфектната си усмивка. Нашият екип за поддръжка е на разположение от понеделник до петък, от 9:00 до 18:00 часа.",
      getInTouch: "Свържете се с нас",
      email: "Имейл",
      phone: "Телефон",
      back: "Назад към началната страница"
    },
    privacy: {
      title: "Политика за поверителност",
      date: "В сила от: 1 януари 2025 г.",
      intro: "Информационна бележка за защита на личните данни\nИнформационен текст за обработката на лични данни\nDENTAŞ AĞIZ VE DİŞ SAĞLIĞI LTD. ŞTİ., (DENTAŞ) като предприятия в рамките на свързаните с него дъщерни дружества, ние придаваме голямо значение на сигурността на вашите лични данни. В съответствие със Закона за защита на личните данни № 6698 („Закон за личните данни“) и „Наредбата за обработка и поверителност на личните здравни данни“, като здравна институция, ние ви информираме, че ще записваме, архивираме, споделяме личната ви информация, необходима за предоставяне на здравни услуги, с упълномощени трети лица/институции, когато е необходимо, и ще я обработваме по начините, изброени в Закона за личните данни. Поради това ви информираме за нашите взаимни права и задължения.",
      section1Title: "1. Обработка на вашите лични данни и администратор на данни",
      section1Content: [
        "За да ви предоставим здравни услуги като администратор на данни като DENTAŞ;",
        "Вашата информация за контакт (адрес, телефонен номер, имейл адрес и др.)",
        "Информираме ви, че ще записваме вашата лична информация, включително вашия IP адрес, информация за браузъра, навигационни данни, получени по време на употреба, и медицински данни, които доброволно предавате чрез мобилното приложение, получени по време на използването на нашия уебсайт и мобилни приложения, и ще ги обработваме в нашите архиви при условията и по начина, предвидени в Закона за личните данни във всеки случай.",
        "Вашите изображения преди или след лечение, генерирани от приложението, качени чрез мобилното приложение, по никакъв начин не се обработват или съхраняват от нас."
      ],
      section2Title: "2. Цел и правно основание за обработка на вашите лични данни",
      section2Intro: "Сред целите на обработката на вашите лични данни са;",
      section2Content: [
        "Опазване на общественото здраве, извършване на медицинска диагностика, лечение и грижи,",
        "Споделяне на исканата информация с Министерството на здравеопазването и други публични институции и организации в съответствие със съответното законодателство,",
        "Предоставяне на информация относно вашия час, ако запишете такъв,",
        "Планиране и управление на вътрешното функциониране на Dentaş,",
        "Извършване на анализ за подобряване на здравните услуги,",
        "С цел изпълнение на дейности в областта на образованието / обучителните институции, с които си сътрудничим,",
        "Финансиране на здравни услуги, фактуриране,",
        "Проверка на вашата самоличност, проверка и потвърждение на отношенията ви с договорени / съответни институции,",
        "Отговаряне на вашите въпроси или жалби относно нашите услуги,",
        "Дейности, свързани с измерване и проучване на удовлетвореността на пациентите с цел повишаване на качеството на услугата,",
        "Доставка на лекарства и медицински изделия,",
        "Участие в кампании и предоставяне на информация за кампании от отделите Маркетинг, Медии и комуникация, Център за обаждания, проектиране и предаване на специално съдържание, материални и нематериални ползи по уеб и мобилни канали.",
        "Правните основания за обработката на вашите лични данни са; изпълнение на нашите законови задължения, произтичащи от съответното вторично законодателство като Постановление със закон за организацията и задълженията на Министерството на здравеопазването и свързаните с него институции № 663, Регламент за частните болници, Комунике за прилагане на здравеопазването, Регламент за правата на пациентите и случаите, ясно предвидени в Закона за частните болници № 2219 и Основния закон за здравните услуги № 3359, както и опазване на общественото здраве, превантивна медицина, медицинска диагностика, лечение и грижи, планиране и управление на здравни услуги и финансиране."
      ],
      section3Title: "3. Прехвърляне на вашите лични данни",
      section3Content: "За целите на общественото здраве и услугите по превантивна медицина и при условията в Закона за защита на личните данни,\nВ случай на искане от упълномощени органи, включително, но не само, Министерството на здравеопазването на ТР и Дирекциите по здравеопазване на провинциите, Центровете за обществено здраве и други звена, свързани с Министерството на здравеопазването, или от лица, назначени от упълномощени органи или в обхвата на установени e-pulse и подобни системи, или в обхвата на нашето задължение за уведомяване и/или докладване, наложено ни, вашите лични данни могат да бъдат споделени със съответните органи и лица,\nНашите преки/непреки местни/чуждестранни акционери, дъщерни дружества и/или филиали, компании от групата,\nС нашите бизнес партньори,\nС адвокати, консултанти, одитори, с които работим, законни представители и трети лица, от които получаваме консултации и упълномощаваме,\nС местни/чуждестранни организации и други трети лица и техните законни представители, от които получаваме договорни услуги и си сътрудничим за извършване на нашите дейности,\nС Институцията за социално осигуряване за пациенти с покритие от SGK, с вашата застрахователна компания, ако използвате частната си застраховка, с вашата институция, ако фактурирането ви трябва да бъде направено на институцията, за която работите,\nС лаборатории, линейки, доставчици на медицински изделия и здравни услуги в Турция или в чужбина, с които си сътрудничим за медицинска диагностика и лечение,\nСъс съответната здравна институция, когато трябва да бъдете насочени,\nГенерална дирекция по сигурността и други правоприлагащи сили,\nГенерална дирекция по населението и гражданството,\nТурска асоциация на фармацевтите,\nС упълномощени от вас законни представители."
    },
    terms: {
      title: "Условия за ползване",
      date: "Последна актуализация: 1 януари 2025 г.",
      intro: "Моля, прочетете внимателно тези Условия за ползване („Условия“), преди да използвате уебсайта и услугите на Design Your Teeth, управлявани от Design Your Teeth Inc.",
      section1Title: "1. Приемане на условията",
      section1Content: "Чрез достъпа до или използването на Услугата вие се съгласявате да бъдете обвързани от тези Условия. Ако не сте съгласни с някоя част от условията, нямате право да използвате Услугата. Тези условия се управляват от Закона за защита на личните данни № 6698 и съответните здравни разпоредби.",
      section2Title: "2. Медицински отказ от отговорност",
      section2Content: "Важно: Визуализациите, предоставени от Design Your Teeth, са само за козметични симулационни цели и не представляват медицински или стоматологични съвети, диагноза или план за лечение. Винаги търсете съвета на вашия зъболекар или друг квалифициран здравен специалист за всякакви въпроси, които може да имате относно стоматологично състояние.",
      section3Title: "3. Отговорности на потребителя и използване на данни",
      section3Intro: "Вие декларирате и гарантирате, че:",
      section3Content: [
        "Имате законното право да качвате изображенията, които изпращате.",
        "Приемате, че вашите данни ще бъдат обработвани в съответствие с нашата Политика за поверителност и Закона за защита на личните данни № 6698.",
        "Вашите изображения преди или след лечение, генерирани от приложението, не се съхраняват от нас, както е описано в нашата Политика за поверителност.",
        "Няма да използвате услугата за никакви незаконни или неразрешени цели."
      ],
      section4Title: "4. Интелектуална собственост",
      section4Content: "Услугата и нейното оригинално съдържание (с изключение на Съдържанието, предоставено от потребителите), характеристики и функционалност са и ще останат изключителна собственост на Design Your Teeth Inc. и нейните лицензодатели.",
      section5Title: "5. Ограничение на отговорността",
      section5Content: "В никакъв случай Design Your Teeth, нито нейните директори, служители, партньори, агенти, доставчици или филиали не носят отговорност за каквито и да е непреки, случайни, специални, последващи или наказателни щети, включително, без ограничение, загуба на печалби, данни, употреба, добра воля или други нематериални загуби, произтичащи от вашия достъп до или използване на или невъзможност за достъп или използване на Услугата."
    }
  }
};
