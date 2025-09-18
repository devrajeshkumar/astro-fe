// search-manager.js - Place this in your head or as external script
(function() {
    'use strict';
    
    // Global Search Manager
    window.SearchManager = {
      instances: new Map(),
      
      // API Configuration
      API_URL: "https://apihindi.etnownews.com/api/search?row=20&start=0&origin=desktop&channel_id=386&searchterms=",
      
      // Initialize a search instance
      init: function(instanceId, options = {}) {
        // Prevent double initialization
        if (this.instances.has(instanceId)) {
          console.warn(`Search instance "${instanceId}" already initialized`);
          return this.instances.get(instanceId);
        }
        
        const wrapper = document.querySelector(`[data-instance="${instanceId}"]`);
        const input = document.getElementById(`searchInput_${instanceId}`);
        const btn = document.getElementById(`searchBtn_${instanceId}`);
        const closeBtn = document.getElementById(`closeBtn_${instanceId}`);
        const resultsContainer = document.getElementById(`resultsContainer_${instanceId}`);
        const hamburger = document.getElementById("hamburgerMenu");
        
        if (!wrapper || !input || !btn || !resultsContainer) {
          console.error(`Search elements not found for instance: ${instanceId}`);
          return null;
        }
        
        // Utility functions
        const utils = {
          sanitizeText: (s) => String(s || ""),
          
          debounce: (fn, wait = 500) => {
            let timer;
            return (...args) => {
              clearTimeout(timer);
              timer = setTimeout(() => fn(...args), wait);
            };
          },
          
          getSlug: (cmstype) => {
            if (!cmstype) return "";
            const ARTICLESLUGMAP = {
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
            };
            return ARTICLESLUGMAP[cmstype] || "";
          }
        };
        
        // API call
        const fetchSearchResults = async (query) => {
          try {
            const res = await fetch(this.API_URL + encodeURIComponent(query));
            const data = await res.json();
            return data?.response || {};
          } catch (err) {
            console.error("Search API error:", err);
            return {};
          }
        };
        
        // Set open/close state
        const setOpen = (open) => {
          resultsContainer.setAttribute("data-open", open ? "true" : "false");
          resultsContainer.setAttribute("aria-hidden", open ? "false" : "true");
          
          if (closeBtn) {
            closeBtn.style.display = open ? "block" : "none";
          }
          
          // Special handling for hamburger instance
          if (instanceId === "hamburger" && hamburger) {
            hamburger.style.display = open ? "none" : "block";
          }
          
          if (!open) {
            input.value = "";
          }
          
          // Emit custom events
          wrapper.dispatchEvent(new CustomEvent(open ? 'search:opened' : 'search:closed', {
            detail: { instanceId }
          }));
        };
        
        // Render search results
        const renderResults = async (query) => {
          const term = String(query || "").trim().toLowerCase();
          resultsContainer.innerHTML = "";
          
          if (!term) {
            setOpen(false);
            return;
          }
          
          // Show loading state
          resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
          setOpen(true);
          
          const response = await fetchSearchResults(term);
          let hasResults = false;
          
          // Clear loading
          resultsContainer.innerHTML = "";
          
          // Define sections to render
          const sections = {
            stocks: "Stocks/IPOs",
            mutualfunds: "Mutual Funds",
            article: "Articles",
            video: "Videos",
            liveblog: "Live Blogs",
            image: "Images",
          };
          
          Object.keys(sections).forEach((key) => {
            const items = response[key] || [];
            if (items.length) {
              hasResults = true;
              const sectionDiv = document.createElement("div");
              sectionDiv.className = "results-section";
              
              const header = document.createElement("h2");
              header.textContent = sections[key];
              sectionDiv.appendChild(header);
              
              const ul = document.createElement("ul");
              items.slice(0, 6).forEach((item) => {
                const li = document.createElement("li");
                li.className = "result-item";
                li.tabIndex = 0;
                
                const a = document.createElement("a");
                const slug = utils.getSlug(item?.cmstype);
                a.href = `/${item?.seopath || ""}${slug ? `-${slug}-` : ""}${item?.msid || ""}`;
                a.textContent = utils.sanitizeText(
                  item?.title || item?.name || item?.compname || item?.S_NAME
                );
                li.dataset.value = a.textContent;
                li.appendChild(a);
                ul.appendChild(li);
              });
              
              sectionDiv.appendChild(ul);
              resultsContainer.appendChild(sectionDiv);
            }
          });
          
          if (hasResults) {
            const footer = document.createElement("a");
            footer.className = "show-all";
            footer.tabIndex = 0;
            footer.href = `https://www.etnownews.com/search-result/${term}`;
            footer.textContent = "Show all results";
            resultsContainer.appendChild(footer);
          } else {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = "No results found";
            resultsContainer.appendChild(noResults);
          }
          
          setOpen(true);
        };
        
        // Event handlers
        const handleInput = utils.debounce((e) => {
          renderResults(e.target.value);
        }, 500);
        
        const handleSearchButton = () => {
          const value = input.value.trim();
          if (!value) {
            const noResults = document.createElement('span');
            noResults.textContent = "No results found";
            noResults.style.cssText = "color: red; text-align: center; font-size: 12px; margin: 10px 0; display: block;";
            resultsContainer.innerHTML = "";
            resultsContainer.appendChild(noResults);
            setOpen(true);
            return;
          }
          window.open(`https://www.etnownews.com/search-result/${value}`);
        };
        
        const handleResultsClick = (ev) => {
          const item = ev.target.closest(".result-item");
          if (item) {
            const value = item.dataset.value || item.textContent;
            input.value = value;
            setOpen(false);
            return;
          }
        };
        
        const handleResultsKeydown = (ev) => {
          if (ev.key === "Enter") {
            const item = ev.target.closest(".result-item");
            if (item) {
              input.value = item.dataset.value || item.textContent;
              setOpen(false);
            }
          }
        };
        
        const handleClickOutside = (e) => {
          if (!resultsContainer.contains(e.target) && e.target !== input) {
            setOpen(false);
          }
        };
        
        const handleKeydown = (e) => {
          if (e.key === "Escape") {
            setOpen(false);
          }
        };
        
        const handleCloseButton = () => {
          setOpen(false);
        };
        
        // Attach event listeners
        input.addEventListener("input", handleInput);
        btn.addEventListener("click", handleSearchButton);
        if (closeBtn) {
          closeBtn.addEventListener("click", handleCloseButton);
        }
        resultsContainer.addEventListener("click", handleResultsClick);
        resultsContainer.addEventListener("keydown", handleResultsKeydown);
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("keydown", handleKeydown);
        
        // Create instance object
        const instance = {
          id: instanceId,
          wrapper: wrapper,
          input: input,
          button: btn,
          closeButton: closeBtn,
          resultsContainer: resultsContainer,
          isOpen: () => resultsContainer.getAttribute("data-open") === "true",
          
          // Public methods
          search: (query) => renderResults(query),
          open: () => setOpen(true),
          close: () => setOpen(false),
          clear: () => {
            input.value = "";
            resultsContainer.innerHTML = "";
            setOpen(false);
          },
          
          // Cleanup method
          destroy: () => {
            input.removeEventListener("input", handleInput);
            btn.removeEventListener("click", handleSearchButton);
            if (closeBtn) {
              closeBtn.removeEventListener("click", handleCloseButton);
            }
            resultsContainer.removeEventListener("click", handleResultsClick);
            resultsContainer.removeEventListener("keydown", handleResultsKeydown);
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleKeydown);
            
            this.instances.delete(instanceId);
            
            // Remove global methods
            delete window[`searchInstance_${instanceId}`];
          }
        };
        
        // Store instance
        this.instances.set(instanceId, instance);
        
        // Create global convenience method
        window[`searchInstance_${instanceId}`] = instance;
        
        // Mark as initialized
        wrapper.setAttribute("data-initialized", "true");
        
        // Initialize as closed
        setOpen(false);
        
        return instance;
      },
      
      // Get instance by ID
      getInstance: function(instanceId) {
        return this.instances.get(instanceId);
      },
      
      // Check if instance exists
      exists: function(instanceId) {
        return this.instances.has(instanceId);
      },
      
      // Search in specific instance
      search: function(instanceId, query) {
        const instance = this.instances.get(instanceId);
        if (instance) {
          instance.search(query);
          return true;
        }
        console.warn(`Search instance "${instanceId}" not found`);
        return false;
      },
      
      // Close all search instances
      closeAll: function() {
        this.instances.forEach((instance) => {
          instance.close();
        });
      },
      
      // Clear all search instances
      clearAll: function() {
        this.instances.forEach((instance) => {
          instance.clear();
        });
      },
      
      // Destroy instance
      destroy: function(instanceId) {
        const instance = this.instances.get(instanceId);
        if (instance) {
          instance.destroy();
          return true;
        }
        return false;
      },
      
      // Destroy all instances
      destroyAll: function() {
        this.instances.forEach((instance) => {
          instance.destroy();
        });
      }
    };
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
      window.SearchManager.destroyAll();
    });
    
  })();