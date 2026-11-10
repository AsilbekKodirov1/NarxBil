// src/lib/i18n.ts
export type Language = "uz" | "ru" | "en";

export interface Translations {
  nav: {
    home: string;
    scanner: string;
    cart: string;
    history: string;
    admin: string;
    login: string;
    logout: string;
  };
  hero: {
    statusBadge: string;
    title1: string;
    titleHighlight: string;
    subtitle: string;
    scanBtn: string;
    cartBtn: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
  };
  steps: {
    sectionBadge: string;
    sectionTitle: string;
    sectionDesc: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    startShopping: string;
    clearAll: string;
    itemsCount: string;
    originalPrice: string;
    savings: string;
    totalToPay: string;
    checkoutBtn: string;
    scanMore: string;
    orderSummary: string;
    cashierCode: string;
    barcodeTab: string;
    qrTab: string;
    cashierInstruction: string;
    confirmOrder: string;
    backToCart: string;
    successOrderToast: string;
    removedToast: string;
    clearedToast: string;
  };
  cashier: {
    title: string;
    subtitle: string;
    scannerReady: string;
    placeholder: string;
    openCart: string;
    cameraScanBtn: string;
    demoOrderBtn: string;
    productsList: string;
    productCol: string;
    barcodeCol: string;
    quantityCol: string;
    priceCol: string;
    totalCol: string;
    totalAmount: string;
    payCash: string;
    payCard: string;
    nextCustomer: string;
    printReceipt: string;
    statusPaid: string;
    statusPending: string;
    waitingTitle: string;
    waitingDesc: string;
    recentOrders: string;
  };
}

export const translations: Record<Language, Translations> = {
  uz: {
    nav: {
      home: "Asosiy",
      scanner: "Skaner",
      cart: "Savat",
      history: "Tarix",
      admin: "Boshqaruv",
      login: "Kirish",
      logout: "Chiqish",
    },
    hero: {
      statusBadge: "OPTOVIK.UZ • Jonli Supermarket Tizimi",
      title1: "Kassaga bormasdan",
      titleHighlight: "narxni aniq biling",
      subtitle: "Telefoningiz kamerasini tovar shtrix kodiga qarating. Do'kondagi haqiqiy narx, chegirmalar va tovar ma'lumotlari 1 soniyada ekranda paydo bo'ladi.",
      scanBtn: "Kamerani yoqish & Skanerlash",
      cartBtn: "Xarid Savatini ko'rish",
      benefit1: "Ilova o'rnatish shart emas",
      benefit2: "Qo'l skaner apparatlariga mos",
      benefit3: "100% Bepul xizmat",
    },
    steps: {
      sectionBadge: "Oddiy va amaliy",
      sectionTitle: "3 ta oson qadamda xarid qiling",
      sectionDesc: "Hech qanday ro'yxatdan o'tmasdan, telefoningizda darhol ishlata olasiz.",
      step1Title: "Shtrix kodni skanerlang",
      step1Desc: "Kamerangizni tovar qadog'idagi shtrix kodga to'g'rilang yoki raqamlarni yozing. Ilova o'rnatish shart emas.",
      step2Title: "Haqiqiy narxni ko'ring",
      step2Desc: "Supermarket kassa bazasidagi eng so'nggi narx, aksiya va chegirmalar darhol ko'rinadi.",
      step3Title: "Savat va Kassa Cheki",
      step3Desc: "Xaridlaringizni qo'shib boring va kassada to'lash uchun bitta tayyor kassa kodini oling.",
    },
    cart: {
      title: "Xarid Savati",
      emptyTitle: "Savatingiz hozircha bo'sh",
      emptyDesc: "Supermarketdagi tovarlarni skanerlang yoki qidiruv orqali savatga qo'shing.",
      startShopping: "Tovar skanerlashni boshlash",
      clearAll: "Savatni tozalash",
      itemsCount: "Mahsulotlar soni:",
      originalPrice: "Asl narxi:",
      savings: "Jami tejov:",
      totalToPay: "JAMI TO'LANADIGAN SUMMA:",
      checkoutBtn: "Buyurtma berish / Kassa kodini olish",
      scanMore: "Yana boshqa tovar skanerlash",
      orderSummary: "Buyurtma Xulosasi",
      cashierCode: "Kassa To'lov Kodi",
      barcodeTab: "Shtrix-kod (Laser skaner)",
      qrTab: "QR-kod",
      cashierInstruction: "Kassir apparati bilan telefoningizdagi ushbu kodni 1 marta skaner qilganda butun savatingiz ochiladi.",
      confirmOrder: "Buyurtmani tasdiqlash",
      backToCart: "Savatga qaytish",
      successOrderToast: "Kassa kodi tasdiqlandi. Kassirga ko'rsating!",
      removedToast: "Savatdan o'chirildi",
      clearedToast: "Savat muvaffaqiyatli tozalandi",
    },
    cashier: {
      title: "Tezkor Kassa Termina (Scan & Go)",
      subtitle: "Mijoz telefoni ekranidagi bitta shtrix-kodni skanerlab butun savatni ochish",
      scannerReady: "Kassa skaneri tayyor",
      placeholder: "Kassa shtrix-kodini skanerlang yoki yozing (masalan: OPT-748291)...",
      openCart: "Savatni ochish",
      cameraScanBtn: "Kamera bilan skanerlash",
      demoOrderBtn: "Sinov uchun demo buyurtma ochish",
      productsList: "Savatdagi mahsulotlar (Bitta-bittalab urish shart emas!)",
      productCol: "Mahsulot",
      barcodeCol: "Shtrix-kod",
      quantityCol: "Soni",
      priceCol: "Narxi",
      totalCol: "Jami",
      totalAmount: "JAMI TO'LANADIGAN SUMMA:",
      payCash: "Naqd Pul Qabul Qilindi",
      payCard: "Plastik Karta (Humo/Uzcard)",
      nextCustomer: "Keyingi xaridorni kutish",
      printReceipt: "Chekni chop etish",
      statusPaid: "TO'LANGAN",
      statusPending: "KUTILMOQDA (PENDING)",
      waitingTitle: "Kassir kutish rejimida",
      waitingDesc: "Xaridor telefonidagi shtrix-kodni skanerlaganingizda, butun savat tafsilotlari darhol shu yerda aks etadi.",
      recentOrders: "Oxirgi Buyurtmalar (Kassa navbati)",
    },
  },
  ru: {
    nav: {
      home: "Главная",
      scanner: "Сканер",
      cart: "Корзина",
      history: "История",
      admin: "Управление",
      login: "Войти",
      logout: "Выйти",
    },
    hero: {
      statusBadge: "OPTOVIK.UZ • Живая система супермаркета",
      title1: "Узнайте точную цену",
      titleHighlight: "до похода на кассу",
      subtitle: "Наведите камеру смартфона на штрих-код товара. Реальная цена супермаркета, скидки и акции появятся на экране за 1 секунду.",
      scanBtn: "Включить камеру и сканировать",
      cartBtn: "Посмотреть корзину",
      benefit1: "Без установки приложений",
      benefit2: "Совместимо с ручными сканерами",
      benefit3: "100% Бесплатный сервис",
    },
    steps: {
      sectionBadge: "Просто и удобно",
      sectionTitle: "Покупки за 3 простых шага",
      sectionDesc: "Работает прямо в браузере телефона без обязательной регистрации.",
      step1Title: "Отсканируйте штрих-код",
      step1Desc: "Наведите камеру на штрих-код на упаковке или введите цифры вручную.",
      step2Title: "Узнайте реальную цену",
      step2Desc: "Самая актуальная цена из кассовой базы магазина со всеми действующими скидками.",
      step3Title: "Корзина и единый чек",
      step3Desc: "Добавляйте товары в корзину и получите один штрих-код для мгновенной оплаты на кассе.",
    },
    cart: {
      title: "Корзина покупок",
      emptyTitle: "Ваша корзина пуста",
      emptyDesc: "Сканируйте товары в зале или воспользуйтесь поиском, чтобы добавить их в корзину.",
      startShopping: "Начать сканирование товаров",
      clearAll: "Очистить корзину",
      itemsCount: "Количество товаров:",
      originalPrice: "Базовая цена:",
      savings: "Общая экономия:",
      totalToPay: "ИТОГО К ОПЛАТЕ:",
      checkoutBtn: "Оформить заказ / Получить код кассы",
      scanMore: "Сканировать еще товар",
      orderSummary: "Итог заказа",
      cashierCode: "Код для оплаты на кассе",
      barcodeTab: "Штрих-код (Для лазера)",
      qrTab: "QR-код",
      cashierInstruction: "Покажите этот штрих-код кассиру. Кассир отсканирует его один раз, и вся корзина появится на кассе.",
      confirmOrder: "Подтвердить заказ",
      backToCart: "Вернуться в корзину",
      successOrderToast: "Код кассы подтвержден. Покажите его кассиру!",
      removedToast: "Удалено из корзины",
      clearedToast: "Корзина успешно очищена",
    },
    cashier: {
      title: "Экспресс-касса (Scan & Go)",
      subtitle: "Сканируйте один штрих-код с телефона покупателя для открытия всей корзины",
      scannerReady: "Сканер кассы готов",
      placeholder: "Отсканируйте или введите код кассы (например: OPT-748291)...",
      openCart: "Открыть корзину",
      cameraScanBtn: "Сканировать камерой",
      demoOrderBtn: "Создать демо-заказ для теста",
      productsList: "Товары в корзине (Не нужно пробивать по одному!)",
      productCol: "Товар",
      barcodeCol: "Штрих-код",
      quantityCol: "Кол-во",
      priceCol: "Цена",
      totalCol: "Итого",
      totalAmount: "ИТОГО К ОПЛАТЕ:",
      payCash: "Оплачено наличными",
      payCard: "Оплачено картой (Humo/Uzcard)",
      nextCustomer: "Ожидать следующего клиента",
      printReceipt: "Печать чека",
      statusPaid: "ОПЛАЧЕНО",
      statusPending: "ОЖИДАЕТ ОПЛАТЫ",
      waitingTitle: "Касса в режиме ожидания",
      waitingDesc: "Отсканируйте код с телефона покупателя, чтобы увидеть все детали заказа.",
      recentOrders: "Последние заказы (Очередь кассы)",
    },
  },
  en: {
    nav: {
      home: "Home",
      scanner: "Scanner",
      cart: "Cart",
      history: "History",
      admin: "Admin",
      login: "Login",
      logout: "Logout",
    },
    hero: {
      statusBadge: "OPTOVIK.UZ • Live Supermarket System",
      title1: "Know the exact price",
      titleHighlight: "before checkout",
      subtitle: "Point your smartphone camera at any product barcode. Real store prices, discounts, and item details appear in 1 second.",
      scanBtn: "Enable Camera & Scan",
      cartBtn: "View Shopping Cart",
      benefit1: "No app installation required",
      benefit2: "Hardware scanner compatible",
      benefit3: "100% Free service",
    },
    steps: {
      sectionBadge: "Simple & Practical",
      sectionTitle: "Shop in 3 easy steps",
      sectionDesc: "Works directly in your mobile browser without mandatory registration.",
      step1Title: "Scan the barcode",
      step1Desc: "Point your camera at the product package barcode or enter the numbers manually.",
      step2Title: "See the real price",
      step2Desc: "Instant live prices and active supermarket promotion discounts from the store database.",
      step3Title: "Cart & Single Receipt",
      step3Desc: "Add items to your cart and get a single barcode for lightning-fast checkout at the cash register.",
    },
    cart: {
      title: "Shopping Cart",
      emptyTitle: "Your cart is currently empty",
      emptyDesc: "Scan products around the supermarket or use search to add them to your cart.",
      startShopping: "Start scanning products",
      clearAll: "Clear cart",
      itemsCount: "Total items:",
      originalPrice: "Original price:",
      savings: "Total savings:",
      totalToPay: "TOTAL AMOUNT TO PAY:",
      checkoutBtn: "Checkout / Get Cashier Code",
      scanMore: "Scan more products",
      orderSummary: "Order Summary",
      cashierCode: "Cashier Payment Code",
      barcodeTab: "Barcode (Laser scanner)",
      qrTab: "QR Code",
      cashierInstruction: "Show this code to the cashier. They scan it once with their scanner, and your entire cart loads instantly.",
      confirmOrder: "Confirm Order",
      backToCart: "Back to Cart",
      successOrderToast: "Cashier code confirmed. Show it to the cashier!",
      removedToast: "Removed from cart",
      clearedToast: "Cart cleared successfully",
    },
    cashier: {
      title: "Express Checkout POS (Scan & Go)",
      subtitle: "Scan one barcode from customer's phone to load entire cart instantly",
      scannerReady: "Cashier scanner ready",
      placeholder: "Scan or enter cashier order code (e.g. OPT-748291)...",
      openCart: "Open Cart",
      cameraScanBtn: "Scan with Camera",
      demoOrderBtn: "Create demo order for test",
      productsList: "Cart Items (No need to scan one by one!)",
      productCol: "Product",
      barcodeCol: "Barcode",
      quantityCol: "Qty",
      priceCol: "Price",
      totalCol: "Total",
      totalAmount: "TOTAL AMOUNT TO PAY:",
      payCash: "Cash Payment Received",
      payCard: "Card Payment (Humo/Uzcard)",
      nextCustomer: "Next Customer",
      printReceipt: "Print Receipt",
      statusPaid: "PAID",
      statusPending: "PENDING",
      waitingTitle: "Cashier standby mode",
      waitingDesc: "Scan the customer's phone barcode to inspect all order items.",
      recentOrders: "Recent Orders (Checkout queue)",
    },
  },
};

