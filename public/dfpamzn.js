function getAdData(el) {
  if (!el || !el.dataset) return null;
  try {
    // base fields
    const adCode = el.dataset.adunit; // that's how it's rendered in data-attributes
    const size = el.dataset.dimensions ? JSON.parse(el.dataset.dimensions) : undefined;
    const divId = el.id || el.dataset.adunit;
 
    // pageTarget related values
    const pageTargetKeys = [
      "section",
      "subsec",
      "pagetype",
      "QueryId",
      "metainfoattr",
      "msid",
      "idx",
      "categoryString",
    ];
    const pageTarget = {};
    pageTargetKeys.forEach((key) => {
      const dataKey = `data-${key.toLowerCase()}`;
      if (el.hasAttribute(dataKey)) {
        // preserve camelCase as per original variable names
        switch (key) {
          case "subsec":
            pageTarget.sub_category = el.dataset.subsec;
            break;
          case "pagetype":
            pageTarget.page = el.dataset.pagetype;
            break;
          case "QueryId":
            pageTarget.query = { id: el.dataset.queryid };
            break;
          case "metainfoattr":
            pageTarget.metaInfoAttr = el.dataset.metainfoattr;
            break;
          case "msid":
            pageTarget.msid = el.dataset.msid;
            break;
          case "idx":
            pageTarget.article_index = el.dataset.idx;
            break;
          case "categoryString":
            pageTarget.categoryString = el.dataset.categoryString;
            break;
          default:
            pageTarget[key] = el.dataset[key];
        }
      }
    });
 
    // queryParams related values
    const queryParamsKeys = ["utm_source", "utm_medium"];
    const queryParams = {};
    queryParamsKeys.forEach((key) => {
      if (el.dataset[key]) {
        queryParams[key] = el.dataset[key];
      }
    });
 
    return {
      adCode,
      size,
      divId,
      pageTarget,
      queryParams,
      dataset: el.dataset || {}
    };
 
  } catch (error) {
    console.log('Error ad data:', error);
    return null;
  }
}
/**
* Render ad immediately
*/
const renderAdvertisement = function ({
  adCode,
  size,
  divId,
  pageTarget = {},
  requestDomain,
  lang,
  queryParams = {},
}) {
  const { utm_source, utm_medium } = queryParams;
  if (!divId || !adCode) return;
 
  let SlotArr = [],
    sec = pageTarget?.section?.category,
    subsec = pageTarget?.section?.sub_category,
    ptype = pageTarget?.page,
    metaInfoAttr = pageTarget?.metaInfoAttr,
    id = pageTarget?.msid,
    sequence = pageTarget?.article_index,
    cdp_audience = pageTarget?.cdp_audience,
    query = pageTarget?.query && Object.values(pageTarget?.query)[0],
    domain =
      requestDomain == lang?.photoCategoryConfig?.domain
        ? "timesnowphotos"
        : "";
 
  let INITIAL_RENDERING = true,
    pubmaticOn = true,
    BID_TIMEOUT = 2000,
    APS_CONFIG = {
      pubID: "2202a6a5-32cd-4e86-a8b6-48b0a3829463",
      adServer: "googletag",
      bidTimeout: BID_TIMEOUT,
    };
 
  // Initialize APS
  if (typeof window.apstag !== "undefined") {
    window.apstag.init(APS_CONFIG);
  }
 
  let slotID = { slotID: divId, sizes: size, slotName: adCode };
 
  window.googletag = window.googletag || { cmd: [] };
 
  googletag.cmd.push(function () {
    let interstitialSlot;
 
    let slot =
      adCode?.includes("_ROS_Interstitial") ||
        adCode?.includes("_iZooto_Interstitial") ||
        adCode?.includes("_ym_Interstitial") ||
        adCode?.includes("_ix_Interstitial") ||
        adCode?.includes("_ind_Interstitial")
        ? googletag
          .defineOutOfPageSlot(
            adCode,
            googletag.enums.OutOfPageFormat.INTERSTITIAL
          )
          ?.addService(googletag.pubads())
        : googletag.defineSlot(adCode, size, divId)?.addService(googletag.pubads());
 
    if (
      adCode?.includes("_ROS_Interstitial") ||
      adCode?.includes("_iZooto_Interstitial") ||
      adCode?.includes("_ym_Interstitial") ||
      adCode?.includes("_ix_Interstitial") ||
      adCode?.includes("_ind_Interstitial")
    ) {
      interstitialSlot = slot;
    }
 
    SlotArr.push(slot);
 
    // Targeting
    googletag.pubads().clearTargeting();
    sec && googletag.pubads().setTargeting("section", [sec]);
    subsec && googletag.pubads().setTargeting("subsec", [subsec]);
    ptype && googletag.pubads().setTargeting("page", [ptype]);
    metaInfoAttr && googletag.pubads().setTargeting("keyword", [metaInfoAttr]);
    id && googletag.pubads().setTargeting("articleid", [id]);
    sequence && googletag.pubads().setTargeting("article_sequence", [sequence]);
    cdp_audience && googletag.pubads().setTargeting("cdp_audience", [cdp_audience]);
    query && googletag.pubads().setTargeting("demo", [query]);
    domain && googletag.pubads().setTargeting("Domain", [domain]);
    utm_source && googletag.pubads().setTargeting("utm_source", [utm_source]);
    utm_medium && googletag.pubads().setTargeting("utm_medium", [utm_medium]);
 
    if (typeof window.getCookieValue !== "undefined") {
      const tg_ppid = window.getCookieValue("tg_ppid");
      tg_ppid && googletag.pubads().setPublisherProvidedId(tg_ppid);
    }
 
    googletag.pubads().setCentering(true);
    googletag.pubads().enableSingleRequest();
    googletag.pubads().enableAsyncRendering();
    googletag.pubads().setPrivacySettings({
      restrictDataProcessing:
        window.getCookieValue?.("privacy-policy") == 1 ? true : false,
    });
 
    googletag.pubads().disableInitialLoad();
    googletag.enableServices();
 
    // Display slot
    if (interstitialSlot) {
      googletag.display(interstitialSlot);
    } else {
      googletag.display(divId);
    }
 
    // APS + Pubmatic bidding
    let isPubDone = false,
      isApsDone = false;
 
    if (pubmaticOn && typeof apstag !== "undefined") {
      apstag.fetchBids({ slots: [slotID] || [], timeout: BID_TIMEOUT }, () => {
        isApsDone = true;
      });
    } else {
      isApsDone = true;
    }
 
    if (window?.PWT?.requestBids && typeof window?.PWT?.requestBids === "function") {
      PWT.initAdserverSet = false;
      PWT.setAuctionTimeout(1000);
      PWT.requestBids(PWT.generateConfForGPT(SlotArr), function (adUnitsArray) {
        PWT.addKeyValuePairsToGPTSlots(adUnitsArray);
        isPubDone = true;
      });
    } else {
      isPubDone = true;
    }
 
    // Refresh once bids are ready
    let refresh = () => {
      if (isPubDone && isApsDone) {
        googletag.cmd.push(function () {
          apstag.setDisplayBids();
          googletag.pubads().refresh(SlotArr);
        });
      } else {
        setTimeout(refresh, 100);
      }
    };
 
    refresh();
  });
}
 
/**
* Lazy load ad using IntersectionObserver
*/
const renderAdvertisementLazy = function (options) {
  const { divId } = options;
  const targetEl = document.getElementById(divId);
  if (!targetEl) return;
 
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.renderAdvertisement(options);
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "200px 0px", threshold: 0.1 }
  );
 
  observer.observe(targetEl);
};
 
/**
* Auto-init: Find all .ad-slot elements and lazyload them
*/
const initAds = function () {
  var googletag = window.googletag || {};
  googletag.cmd = googletag.cmd || [];
  const adToRender = (adSelector) => {
    document.querySelectorAll(adSelector).forEach((el) => {
      try {
        const d = getAdData(el)
        if (!d) return;
        const options = {
          adCode: d.adCode,
          size: d.size,
          divId: d.divId,
          pageTarget: d.pageTarget,
          queryParams: d.queryParams
        };
        if (d.lazyload) {
          renderAdvertisementLazy(options)
        } else {
          renderAdvertisement(options);
        }
 
      } catch (error) {
        console.log('Error adToRender:', error);
 
      }
    });
 
  };
 
  const script = document.createElement("script");
  script.id = "dfpgpt";
  script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  script.async = true;
 
  document.head.appendChild(script);
 
  script.onload = function () {
    // Render immediately visible ads
    adToRender(".dfp");
 
    // Render delayed ads after page load
    // window.addEventListener("load", function () {
    //   setTimeout(function () {
    //     adToRender(".dfp-delay");
    //   }, 7000);
    // });
  };
};
window.renderAdvertisement = renderAdvertisement;
window.renderAdvertisementLazy = renderAdvertisementLazy;
window.initAds = initAds;
 
 
// Kick off when DOM ready
document.addEventListener("DOMContentLoaded", function () {
  initAds()
})
