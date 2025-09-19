/**
 * Singleton Ad Manager Class
 * Handles DFP script loading, ad rendering, and lazy loading
 */
class AdManager {
    constructor() {
      if (AdManager.instance) {
        return AdManager.instance;
      }
  
      this.isInitialized = false;
      this.isDFPScriptLoaded = false;
      this.pendingAds = new Map();
      this.observers = new Map();
      this.activeSlots = new Map(); // Track active slots
      this.slotsBeingCreated = new Set(); // Track slots being created
      this.config = {
        BID_TIMEOUT: 2000,
        APS_CONFIG: {
          pubID: "2202a6a5-32cd-4e86-a8b6-48b0a3829463",
          adServer: "googletag",
          bidTimeout: 2000,
        },
        pubmaticOn: true,
      };
  
      AdManager.instance = this;
      this.init();
    }
  
    /**
     * Initialize the Ad Manager
     */
    async init() {
      if (this.isInitialized) return;

      // Load DFP script once
      await this.loadDFPScript();
      
      // Initialize googletag
      this.initializeGoogleTag();
      
      // Initialize APS if available
      this.initializeAPS();
      
      this.isInitialized = true;
      
      // Process any pending ads
      this.processPendingAds();
    }
  
    /**
     * Load DFP script once
     */
    loadDFPScript() {
      return new Promise((resolve, reject) => {
        if (this.isDFPScriptLoaded || document.getElementById('dfpgpt')) {
          resolve();
          return;
        }
  
        const script = document.createElement("script");
        script.id = "dfpgpt";
        script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
        script.async = true;
  
        script.onload = () => {
          this.isDFPScriptLoaded = true;
          resolve();
        };
  
        script.onerror = () => {
          console.error("[AdManager] Failed to load DFP script");
          reject(new Error('DFP script failed to load'));
        };
  
        document.head.appendChild(script);
      });
    }
  
    /**
     * Initialize Google Tag
     */
    initializeGoogleTag() {
      window.googletag = window.googletag || { cmd: [] };
      
      window.googletag.cmd.push(() => {
        // Clear any existing slots before setting up
        if (window.googletag.destroySlots) {
          window.googletag.destroySlots();
          this.activeSlots.clear();
        }
        
        window.googletag.pubads().setCentering(true);
        window.googletag.pubads().enableSingleRequest();
        window.googletag.pubads().enableAsyncRendering();
        window.googletag.pubads().setPrivacySettings({
          restrictDataProcessing: window.getCookieValue?.("privacy-policy") == 1,
        });
        window.googletag.pubads().disableInitialLoad();
        window.googletag.enableServices();
      });
    }
  
    /**
     * Initialize APS
     */
    initializeAPS() {
      if (typeof window.apstag !== "undefined") {
        window.apstag.init(this.config.APS_CONFIG);
      }
    }
  
    /**
     * Process pending ads that were queued before initialization
     */
    processPendingAds() {
      this.pendingAds.forEach((adConfig, adId) => {
        this.renderAd(adConfig);
      });
      this.pendingAds.clear();
    }
  
    /**
     * Extract ad data from element
     */
    getAdData(el) {
      if (!el || !el.dataset) {
        return null;
      }
  
      try {
        const adCode = el.dataset.adunit;
        const size = el.dataset.dimensions ? JSON.parse(el.dataset.dimensions) : undefined;
        const divId = el.id || el.dataset.adunit;
  
        const pageTargetKeys = [
          "section", "subsec", "pagetype", "QueryId",
          "metainfoattr", "msid", "idx", "categoryString",
        ];
        
        const pageTarget = {};
        pageTargetKeys.forEach((key) => {
          const dataKey = `data-${key.toLowerCase()}`;
          if (el.hasAttribute(dataKey)) {
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
                pageTarget.categoryString = el.dataset.categorystring;
                break;
              default:
                pageTarget[key] = el.dataset[key];
            }
          }
        });
  
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
        console.error("[AdManager] Error parsing ad data:", error);
        return null;
      }
    }
  
    /**
     * Render advertisement
     */
    renderAd(options) {
      const { adCode, size, divId, pageTarget = {}, queryParams = {} } = options;
  
      if (!this.isInitialized) {
        this.pendingAds.set(divId, options);
        return;
      }
  
      if (!divId || !adCode) {
        console.warn("[AdManager] Missing divId or adCode", { divId, adCode });
        return;
      }
  
      // Check if slot already exists or is being created
      if (this.activeSlots.has(divId) || this.slotsBeingCreated.has(divId)) {
        console.warn("[AdManager] Slot already exists or being created for:", divId);
        return;
      }
  
      // Check if DOM element exists
      const element = document.getElementById(divId);
      if (!element) {
        console.warn("[AdManager] DOM element not found:", divId);
        return;
      }
  
      // Mark slot as being created
      this.slotsBeingCreated.add(divId);  
      const { utm_source, utm_medium } = queryParams;
      let SlotArr = [];
  
      const slotID = { slotID: divId, sizes: size, slotName: adCode };
  
      window.googletag.cmd.push(() => {
        try {
          // Double-check that slot doesn't exist
          if (this.activeSlots.has(divId)) {
            console.warn("[AdManager] Slot already exists during creation:", divId);
            this.slotsBeingCreated.delete(divId);
            return;
          }
  
          // Define slot
          let slot;
          const isInterstitial = this.isInterstitialAd(adCode);
          
          if (isInterstitial) {
            slot = window.googletag
              .defineOutOfPageSlot(adCode, window.googletag.enums.OutOfPageFormat.INTERSTITIAL)
              ?.addService(window.googletag.pubads());
          } else {
            slot = window.googletag
              .defineSlot(adCode, size, divId)
              ?.addService(window.googletag.pubads());
          }
  
          if (!slot) {
            console.error("[AdManager] Failed to define slot for:", adCode);
            this.slotsBeingCreated.delete(divId);
            return;
          }
  
          // Store the slot reference
          this.activeSlots.set(divId, slot);
          SlotArr.push(slot);
          // Apply targeting
          this.applyTargeting(pageTarget, queryParams);
  
          // Display ad
          if (isInterstitial) {
            window.googletag.display(slot);
          } else {
            window.googletag.display(divId);
          }
  
          // Handle bidding
          this.handleBidding(SlotArr, slotID);
  
        } catch (error) {
          console.error("[AdManager] Error creating slot:", error);
          this.activeSlots.delete(divId);
        } finally {
          this.slotsBeingCreated.delete(divId);
        }
      });
    }
  
    /**
     * Check if ad is interstitial
     */
    isInterstitialAd(adCode) {
      const interstitialTypes = [
        "_ROS_Interstitial", "_iZooto_Interstitial", "_ym_Interstitial",
        "_ix_Interstitial", "_ind_Interstitial"
      ];
      return interstitialTypes.some(type => adCode?.includes(type));
    }
  
    /**
     * Check if slot already exists
     */
    slotExists(divId) {
      return this.activeSlots.has(divId) || this.slotsBeingCreated.has(divId);
    }
  
    /**
     * Get all active slots
     */
    getActiveSlots() {
      return Array.from(this.activeSlots.keys());
    }
  
    /**
     * Apply targeting to ads
     */
    applyTargeting(pageTarget, queryParams) {
        function getCohortData() {
          if (typeof document !== 'undefined') {
            const cohortData = localStorage.getItem('cdp_audience');
            if (cohortData) {
              return cohortData.split(',');
            }
          }
          return [];
        };
      window.googletag.pubads().clearTargeting();
      const targetingMap = {
        section: pageTarget?.section?.category,
        subsec: pageTarget?.section?.sub_category || pageTarget?.sub_category,
        page: pageTarget?.page,
        keyword: pageTarget?.metaInfoAttr,
        articleid: pageTarget?.msid,
        article_sequence: pageTarget?.article_index,
        cdp_audience: pageTarget?.cdp_audience,
        demo: pageTarget?.query && Object.values(pageTarget?.query)[0],
        utm_source: queryParams?.utm_source,
        utm_medium: queryParams?.utm_medium,
      };
  
      Object.entries(targetingMap).forEach(([key, value]) => {
        if (value) {
          window.googletag.pubads().setTargeting(key, [value]);
        }
      });
  
      let customParams;
      if (typeof window !== 'undefined' && window.cdpCustomParams) {
        customParams = window.cdpCustomParams;
      }
      if (customParams && typeof customParams === 'object') {
        Object.keys(customParams).forEach((key) => {
          window.googletag.pubads().setTargeting(key, [customParams[key]]);
        });
      }
      // Set publisher provided ID
      if (typeof window.getCookieValue !== "undefined") {
        const tg_ppid = window.getCookieValue("tg_ppid");
        if (tg_ppid) {
          window.googletag.pubads().setPublisherProvidedId(tg_ppid);
        }
      }
     let cohortList = getCohortData();
      if(cohortList) {
        window.googletag.pubads().setTargeting("cdp_audience", cohortList);
      }
    }
  
    /**
     * Handle bidding process
     */
    handleBidding(SlotArr, slotID) {
      let isPubDone = false;
      let isApsDone = false;
  
      // APS bidding
      if (this.config.pubmaticOn && typeof window.apstag !== "undefined") {
        window.apstag.fetchBids(
          { slots: [slotID] || [], timeout: this.config.BID_TIMEOUT },
          () => {
            isApsDone = true;
          }
        );
      } else {
        isApsDone = true;
      }
  
      // PubMatic bidding
      if (window?.PWT?.requestBids && typeof window?.PWT?.requestBids === "function") {
        window.PWT.initAdserverSet = false;
        window.PWT.setAuctionTimeout(1000);
        window.PWT.requestBids(
          window.PWT.generateConfForGPT(SlotArr),
          (adUnitsArray) => {
            window.PWT.addKeyValuePairsToGPTSlots(adUnitsArray);
            isPubDone = true;
          }
        );
      } else {
        isPubDone = true;
      }
  
      // Refresh when bids are ready
      const refresh = () => {
        if (isPubDone && isApsDone) {
          window.googletag.cmd.push(() => {
            if (window.apstag) {
              window.apstag.setDisplayBids();
            }
            window.googletag.pubads().refresh(SlotArr);
          });
        } else {
          setTimeout(refresh, 100);
        }
      };
  
      refresh();
    }
  
    /**
     * Setup lazy loading for an ad
     */
    setupLazyLoading(element, options) {
      const { divId } = options;
      
      if (!element) {
        console.warn("[AdManager] Element not found for lazy loading:", divId);
        return;
      }
  
      const observerId = `lazy-${divId}-${Date.now()}`;
      
      if (this.observers.has(observerId)) {
        return; // Already observing
      }
  
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.renderAd(options);
              observer.unobserve(entry.target);
              this.observers.delete(observerId);
            }
          });
        },
        {
          rootMargin: "200px 0px",
          threshold: 0.1
        }
      );
  
      this.observers.set(observerId, observer);
      observer.observe(element);
    }
  
    /**
     * Auto-discover and render ads
     */
    discoverAndRenderAds(selector = '.dfp') {
      
      const elements = document.querySelectorAll(selector);
  
      elements.forEach((el) => {
        try {
          // Skip if element is already initialized
          if (el.dataset.initialized === "true") {
            return;
          }
  
          const adData = this.getAdData(el);
          if (!adData) {
            return;
          }
  
          // Skip if slot already exists
          if (this.slotExists(adData.divId)) {
            return;
          }
  
          const options = {
            adCode: adData.adCode,
            size: adData.size,
            divId: adData.divId,
            pageTarget: adData.pageTarget,
            queryParams: adData.queryParams
          };
  
          // Mark element as initialized
          el.dataset.initialized = "true";
  
          // Check if should lazy load
          if (el.dataset.lazyload === 'true' || el.classList.contains('lazy-ad')) {
            this.setupLazyLoading(el, options);
          } else {
            this.renderAd(options);
          }
  
        } catch (error) {
          console.error("[AdManager] Error processing ad element:", error);
        }
      });
    }
  
    /**
     * Cleanup observers and slots (useful for SPA navigation)
     */
    cleanup() {
      
      // Disconnect observers
      this.observers.forEach((observer) => {
        observer.disconnect();
      });
      this.observers.clear();
      
      // Clear pending ads
      this.pendingAds.clear();
      
      // Destroy GPT slots
      window.googletag = window.googletag || { cmd: [] };
      window.googletag.cmd.push(() => {
        if (window.googletag.destroySlots && this.activeSlots.size > 0) {
          const slotsToDestroy = Array.from(this.activeSlots.values());
          window.googletag.destroySlots(slotsToDestroy);
        }
      });
      
      // Clear slot tracking
      this.activeSlots.clear();
      this.slotsBeingCreated.clear();
    }
  
    /**
     * Destroy specific slot
     */
    destroySlot(divId) {
      if (this.activeSlots.has(divId)) {
        const slot = this.activeSlots.get(divId);
        window.googletag.cmd.push(() => {
          window.googletag.destroySlots([slot]);
        });
        this.activeSlots.delete(divId);
      }
    }
  
    /**
     * Static method to get instance
     */
    static getInstance() {
      if (!AdManager.instance) {
        new AdManager();
      }
      return AdManager.instance;
    }
  }
  
  // Global initialization
  window.AdManager = AdManager;
  
  // Auto-initialize when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    const adManager = AdManager.getInstance();
    
    // Discover and render immediate ads
    setTimeout(() => {
      adManager.discoverAndRenderAds('.dfp');
    }, 100);
  });
  
  // Handle SPA navigation (Astro specific)
  document.addEventListener("astro:before-swap", () => {
    const adManager = AdManager.getInstance();
    adManager.cleanup();
  });
  
  document.addEventListener("astro:after-swap", () => {
    const adManager = AdManager.getInstance();
    setTimeout(() => {
      adManager.discoverAndRenderAds('.dfp');
    }, 200);
  });