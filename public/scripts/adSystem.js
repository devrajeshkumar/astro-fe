
(function() {
    'use strict';
    if (typeof window !== 'undefined') {
      const initAdSystem = () => {
        const adManager = window.AdManager?.getInstance();
        
        if (!adManager) {
          console.error("[AdSystem] AdManager class not found");
          return false;
        }
        setupGlobalEventListeners(adManager);
        return true;
      };
  
      const setupGlobalEventListeners = (adManager) => {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            setTimeout(() => {
              adManager.discoverAndRenderAds('.dfp:not([data-initialized="true"])');
            }, 500);
          }
        });
        let resizeTimeout;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
          }, 300);
        });
        let scrollTimeout;
        window.addEventListener('scroll', () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
          }, 100);
        }, { passive: true });
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdSystem);
      } else {
        initAdSystem();
      }
      document.addEventListener('astro:before-swap', () => {
        const adManager = window.AdManager?.getInstance();
        if (adManager) {
          adManager.cleanup();
        }
      });
  
      document.addEventListener('astro:after-swap', () => {
        setTimeout(() => {
          const adManager = window.AdManager?.getInstance();
          if (adManager) {
            // Clear any existing state first
            adManager.activeSlots.clear();
            adManager.slotsBeingCreated.clear();
            // Then discover new ads
            adManager.discoverAndRenderAds('.dfp');
          }
        }, 200);
      });
  
      // Handle page visibility changes for cleanup
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          // Page is being hidden, prepare for potential cleanup
          const adManager = window.AdManager?.getInstance();
          if (adManager && window.performance?.navigation?.type === 1) {
            // This is a page reload, clear slots
            adManager.activeSlots.clear();
            adManager.slotsBeingCreated.clear();
          }
        }
      });
  
      // Expose utility functions globally
      window.AdSystemUtils = {
        // Manually render a specific ad
        renderAd: (selector) => {
          const adManager = window.AdManager?.getInstance();
          if (adManager) {
            const element = document.querySelector(selector);
            if (element) {
              const adData = adManager.getAdData(element);
              if (adData) {
                // Check if slot already exists
                if (adManager.slotExists(adData.divId)) {
                  console.warn("[AdSystemUtils] Slot already exists for:", adData.divId);
                  return false;
                }
                
                adManager.renderAd({
                  adCode: adData.adCode,
                  size: adData.size,
                  divId: adData.divId,
                  pageTarget: adData.pageTarget,
                  queryParams: adData.queryParams
                });
                return true;
              }
            }
          }
          return false;
        },
  
        // Refresh all ads on page
        refreshAllAds: () => {
          const adManager = window.AdManager?.getInstance();
          if (adManager) {
            // Clear existing slots first
            adManager.cleanup();
            setTimeout(() => {
              adManager.discoverAndRenderAds('.dfp[data-initialized="true"]');
            }, 100);
          }
        },
  
        // Destroy a specific ad slot
        destroyAd: (divId) => {
          const adManager = window.AdManager?.getInstance();
          if (adManager) {
            adManager.destroySlot(divId);
            const element = document.getElementById(divId);
            if (element) {
              element.dataset.initialized = "false";
            }
          }
        },
  
        // Get ad performance stats
        getStats: () => {
          const adManager = window.AdManager?.getInstance();
          if (adManager) {
            return {
              initialized: adManager.isInitialized,
              pendingAds: adManager.pendingAds.size,
              observers: adManager.observers.size,
              dfpLoaded: adManager.isDFPScriptLoaded,
              activeSlots: adManager.activeSlots.size,
              slotsBeingCreated: adManager.slotsBeingCreated.size,
              activeSlotsIds: adManager.getActiveSlots()
            };
          }
          return null;
        },
  
        // Force cleanup and reinitialize
        reset: () => {
          const adManager = window.AdManager?.getInstance();
          if (adManager) {
            adManager.cleanup();
            document.querySelectorAll('.dfp').forEach(el => {
              el.dataset.initialized = "false";
            });
            setTimeout(() => {
              adManager.discoverAndRenderAds('.dfp');
            }, 500);
          }
        }
      };
  
    }
  })();
