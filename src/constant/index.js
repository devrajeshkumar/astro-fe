const CONST = {
  MGID_ADD_1X1: 1417126,
  MGID_ADD_5X5: 1424749,
  MGID_LIVE_BLOG_1X1: 1347386,
  MGID_LIVE_BLOG_5X5: 1424749,
  MGID_LIVE_BLOG_1X1_AMP: 1122576,
  MGID_LIVE_BLOG_5X5_AMP: 1424749,
  MGID_LIVE_TV_5X5: 1347378,
  MGID_LIVE_TV: 1765519,
  MGID_ADD_1X1_HI: 1523817,
  MGID_ADD_5X5_HI: 1523815,

  STOCK_LINKS: [
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/numeric-stock`,
      value: "#",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/a`,
      value: "A",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/b`,
      value: "B",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/c`,
      value: "C",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/d`,
      value: "D",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/e`,
      value: "E",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/f`,
      value: "F",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/g`,
      value: "G",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/h`,
      value: "H",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/i`,
      value: "I",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/j`,
      value: "J",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/k`,
      value: "K",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/l`,
      value: "L",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/m`,
      value: "M",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/n`,
      value: "N",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/o`,
      value: "O",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/p`,
      value: "P",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/q`,
      value: "Q",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/r`,
      value: "R",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/s`,
      value: "S",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/t`,
      value: "T",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/u`,
      value: "U",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/v`,
      value: "V",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/w`,
      value: "W",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/x`,
      value: "X",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/y`,
      value: "Y",
    },
    {
      link: `https://www.etnownews.com/stocks/stock-price-quote/z`,
      value: "Z",
    },
  ],
  SSO_AUTH: {
    CHANNEL: "tnnet",
    PLATFORM: "WEB",
    SSO_BASEURL: "",
    REDIRECT_URL: import.meta.env.WEBAPP_BASE_URL,
    SOCIAL_APP: {
      FB: {
        F_URL: "/fb/home",
        F_APP_ID: "1546988615744423",
        F_APP_SECRET_ID: "a3160d5b7c73cfedcaf4ec47744e622d",
      },
      GOOGLE: {
        G_URL: "/google/home",
        G_CLIENT_ID:
          "48539669424-nc92l47o2q9njqf9fv3ijdk5u5vmpg5k.apps.googleusercontent.com",
        G_APP_SECRET_ID: "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",
      },
    },
    SOCIAL_APP_BASEURL: import.meta.env.SOCIAL_APP_BASEURL,
  },
  ARTICLESLUGMAP: {
    VIDEOS: "video",
    MEDIAVIDEO: "video",
    MOVIEREVIEW: "review",
    ARTICLE: "article",
    LIVEBLOG: "liveblog",
    PHOTOGALLERYSLIDESHOWSECTION: "photo-gallery",
    IMAGES: "photostory",
    PHOTOGALLERYLISTSECTION: "photostory",
    MEDIAAUDIO: "audio",
    SHORTMEDIAVIDEO: "reels",
  },
};
export default CONST;

export const CATEGORY_TYPES = {
  auto: "Auto",
  business: "business",
  cricket: "cricket",
  crime: "crime",
  cities: "ctynews",
  education: "education",
  election: "election",
  entertainment: "entertainment",
  health: "health",
  india: "india",
  lifestyle: "LifeStyle",
  home: "livetv",
  "live-tv": "livetv",
  newindianewdirection: "newindianewdirection",
  olympics: "olympics",
  recipesinhindi: "recipesinhindi",
  "sarkari-naukri": "sarkari_naukri",
  sports: "sports",
  "tech-gadgets": "tech_gadgets",
  viral: "trendingviral",
  unnewshindi: "unnewshindi",
  videos: "Video",
  world: "world",
  yearendspecial: "yearendspecial",
};
export const CATEGORY_TYPE_VIDEO_ARTICLE = "Article Story";
export const GLANCE_PREROLL_ADCODES = {
  s: "https://pubads.g.doubleclick.net/gampad/ads?iu=/21806551354/ETNow/Mweb/Glance_Samsung/ETNow_Mweb_Samsung_Video_Preroll&description_url=[placeholder]&tfcd=0&npa=0&sz=400x300%7C420x315%7C480x361%7C640x360%7C640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=",
  x: "https://pubads.g.doubleclick.net/gampad/ads?iu=/21806551354/ETNow/Mweb/Glance_Xiaomi/ETNow_Mweb_Xiaomi_Video_Preroll&description_url=[placeholder]&tfcd=0&npa=0&sz=400x300%7C420x315%7C480x360%7C640x360%7C640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=",
  r: "https://pubads.g.doubleclick.net/gampad/ads?iu=/21806551354/ETNow/Mweb/Glance_Realme_Color_OS/ETNow_Mweb_RealmeColor_Video_Preroll&description_url=[placeholder]&tfcd=0&npa=0&sz=400x300%7C420x315%7C480x361%7C640x360%7C640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=",
  aosp: "https://pubads.g.doubleclick.net/gampad/ads?iu=/21806551354/ETNow/Mweb/Glance_Realme_AOSP/ETNow_Mweb_RealmeAOSP_Video_Preroll&description_url=[placeholder]&tfcd=0&npa=0&sz=320x480%7C400x300%7C420x315%7C480x361%7C640x360%7C640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=",
  go: "https://pubads.g.doubleclick.net/gampad/ads?iu=/21806551354/ETNow/Mweb/Glance_Realme_Go/ETNow_Mweb_RealmeCo_Video_Preroll&description_url=[placeholder]&tfcd=0&npa=0&sz=320x480%7C400x300%7C420x315%7C480x361%7C640x360%7C640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=",
  mgo: "https://pubads.g.doubleclick.net/gampad/ads?iu=/21806551354/ETNow/Mweb/Glance_Motorola_Go/ETNow_Mweb_MotorolaGo_Video_Preroll&description_url=[placeholder]&tfcd=0&npa=0&sz=320x480%7C400x300%7C420x315%7C480x361%7C640x360%7C640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=",
  maosp:
    "https://pubads.g.doubleclick.net/gampad/ads?iu=/21806551354/ETNow/Mweb/Glance_Motorola_AOSP/ETNow_Mweb_MotorolaAOSP_Video_Preroll&description_url=[placeholder]&tfcd=0&npa=0&sz=320x480%7C400x300%7C420x315%7C480x361%7C640x360%7C640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=",
};
export const GLANCE_PREROLL_DEFAULT =
  "https://pubads.g.doubleclick.net/gampad/ads?iu=/21806551354/ETNow/Mweb/Glance_Default/ETNow_Mweb_Default_Video_Preroll&description_url=[placeholder]&tfcd=0&npa=0&sz=320x480%7C400x300%7C420x315%7C480x361%7C640x360%7C640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=";
export const IMG_DOMAIN = "https://images.etnownews.com";
export const DEFAULT_IMAGE_WIDTH = 200;
export const DEFAULT_IMAGE_HEIGHT = 200;
export const CHANNEL_MSID = {
  "1x88crm9oz": "89109097",
  "1x8fb7i9o6": "89109076",
  "1xvwd5j96g": "152327132",
  "1x88csv9oz": "89109116",
  "1x8fbim9o6": "152327095",
};
export const DEFAULT_IMAGE_MSID = "95598012";

export const GNS_FEED = {
  latest: "latest",
  "latest-news": "latest",
  news: "news",
  markets: "markets",
  companies: "companies",
  "personal-finance": "personal-finance",
  "mutual-funds": "mutual-funds",
  cryptocurrency: "cryptocurrency",
  videos: "videos",
  "news-letter": "news-letter",
  "sitemap-etnow": "sitemap",
  budget: "budget",
  "exams-results": "exams-results",
  // 'web-stories': 'web-stories', // originally commented
  auto: "auto",
  technology: "technology",
  "breaking-news": "breaking-news",
  "business-summit": "business-summit",
  infrastructure: "infrastructure",
  "et-now-luxe": "et-now-luxe",
  entertainment: "entertainment",
  "success-stories": "success-stories",
  economy: "economy",
  "real-estate": "real-estate",
  jobs: "jobs",
  "income-tax": "income-tax",
  elections: "elections",
  sports: "sports",
};

export const BOTTOMNAV = [
  {
    label: "Home",
    link: `${import.meta.env.WEBAPP_BASE_URL}`,
    icon: "HomeIcon",
    activeIcon: "HomeIconRed",
    width: "20",
    height: "20",
    active: false,
  },
  {
    label: "News",
    link: `${import.meta.env.WEBAPP_BASE_URL}/news`,
    icon: "newsIconBlack",
    activeIcon: "newsIconRed",
    width: "20",
    height: "20",
    active: false,
  },
  {
    label: "Live TV",
    link: `${import.meta.env.WEBAPP_BASE_URL}/live-tv`,
    icon: "LiveTvIcon",
    activeIcon: "LiveTvIconRed",
    width: "20",
    height: "20",
    active: false,
  },
  {
    label: "Web Stories",
    link: `${import.meta.env.WEBAPP_BASE_URL}/web-stories`,
    icon: "storyWithoutShadowBlack",
    activeIcon: "storyWithoutShadowRed",
    width: "20",
    height: "20",
    active: false,
  },
  {
    label: "Market",
    link: `${import.meta.env.WEBAPP_BASE_URL}/market-overview`,
    icon: "MarketIcon",
    activeIcon: "MarketIconRed",
    width: "20",
    height: "20",
    active: false,
  },
];

export const SOCIAL_LINKS = {
  FB: "https://www.facebook.com/etnowswadesh",
  TW: "https://www.instagram.com/etnowswadesh",
  IG: "https://www.instagram.com/etnowswadesh",
};

export const FOLLOW_US_LINK = {
  ET_ENG: {
    fb: {
      link: "https://www.facebook.com/etnow",
      title: "fb",
      svgicon: "LightFbIcon",
    },
    whatsapp: {
      link: "https://www.whatsapp.com/channel/0029Va7OSzxA2pL8ezY1aw1K",
      title: "whtsapp",
      svgicon: "LightWhatsAppIcon",
    },
    twitter: {
      link: "https://twitter.com/ETNOWlive",
      title: "twitter",
      svgicon: "WhiteTwitterXIcon",
    },
    insta: {
      link: "https://www.instagram.com/etnow",
      title: "insta",
      svgicon: "InstagramIconApp",
    },
    googlenews: {
      link: "https://news.google.com/publications/CAAqBwgKMK3HxQsw0OLcAw?hl=en-IN&gl=IN&ceid=IN%3Aen",
      title: "googlenews",
      svgicon: "GoogleNewsIcon",
    },
  },
  ET_HINDI: {
    fb: {
      link: "https://www.facebook.com/etnowswadesh",
      title: "fb",
      svgicon: "LightFbIcon",
    },
    whatsapp: {
      link: "https://www.whatsapp.com/channel/0029Va6oRATFMqrdmynHxw1p",
      title: "whtsapp",
      svgicon: "LightWhatsAppIcon",
    },
    twitter: {
      link: "https://twitter.com/ETNowSwadesh",
      title: "twitter",
      svgicon: "WhiteTwitterXIcon",
    },
    insta: {
      link: "https://www.instagram.com/etnowswadesh",
      title: "insta",
      svgicon: "InstagramIconApp",
    },
    googlenews: {
      link: "https://news.google.com/publications/CAAqBwgKMO310AswrJHoAw?hl=en-IN&gl=IN&ceid=IN%3Aen",
      title: "googlenews",
      svgicon: "GoogleNewsIcon",
    },
  },
  ZOOM: {
    fb: {
      link: "https://www.facebook.com/zoomtv",
      title: "fb",
      svgicon: "LightFbIcon",
    },
    whatsapp: {
      link: "https://whatsapp.com/channel/0029Va7YvsnFnSzESCe4zL0C",
      title: "whtsapp",
      svgicon: "LightWhatsAppIcon",
    },
    twitter: {
      link: "https://twitter.com/ZoomTV",
      title: "twitter",
      svgicon: "WhiteTwitterXIcon",
    },
    insta: {
      link: "https://www.instagram.com/zoomtv/",
      title: "insta",
      svgicon: "InstagramIconApp",
    },
    // telegram: {
    //   link: 'https://t.me/zoomtvnews',
    //   title: 'telgram',
    //   svgicon: 'ZoomLogo',
    // },
    googlenews: {
      link: "https://news.google.com/publications/CAAqBwgKMM6A_gow7bf2Ag?hl=en-IN&gl=IN&ceid=IN:en",
      title: "googlenews",
      svgicon: "GoogleNewsIcon",
    },
  },
};
export const JOIN_US_LINK = {
  WHATSAPP: "https://www.whatsapp.com/channel/0029Va7OSzxA2pL8ezY1aw1K",
  GOOGLE:
    "https://news.google.com/publications/CAAqKAgKIiJDQklTRXdnTWFnOEtEV1YwYm05M2JtVjNjeTVqYjIwb0FBUAE?hl=en-IN&gl=IN&ceid=IN:en",
};
export const HDFC_CTR = {
  link: "https://docs.google.com/forms/d/e/1FAIpQLSeVvQ0d47nh8kfkcL7jwK3CPCLXLoJauxmIiVJfDAd5GXVYpg/viewform",
};
export const isValidUrlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
export const ET_HINDI_LOGO_MSID = 111599358;