// accordion-manager.js - Place this in your head or as external script
(function() {
  'use strict';
  
  // Global Accordion Manager
  window.AccordionManager = {
    instances: new Map(),
    
    // Initialize an accordion instance
    init: function(instanceId, options = {}) {
      // Prevent double initialization
      if (this.instances.has(instanceId)) {
        console.warn(`Accordion instance "${instanceId}" already initialized`);
        return this.instances.get(instanceId);
      }
      
      const accordion = document.querySelector(`[data-instance="${instanceId}"]`);
      if (!accordion) {
        console.error(`Accordion with instance ID "${instanceId}" not found`);
        return null;
      }
      
      const trigger = accordion.querySelector("[data-accordion-trigger]");
      const content = accordion.querySelector("[data-accordion-content]");
      const toggleButton = accordion.querySelector(".accordion-toggle");
      
      if (!trigger || !content) {
        return null;
      }
      
      // Default options
      const config = {
        closePrev: options.closePrev || false,
        animationDuration: options.animationDuration || 300,
        defaultOpen: options.defaultOpen || false,
        cssModules: options.cssModules || {},
        ...options
      };
      
      // Get CSS class name (CSS modules or regular)
      const getClassName = (baseName) => {
        return config.cssModules[baseName] || baseName;
      };
      
      // Set initial state
      const setOpen = (open, animate = true) => {
        console.log(`Setting accordion ${instanceId} to:`, open ? 'open' : 'closed');
        
        if (open) {
          const openClass = getClassName('open');
          const closeClass = getClassName('close');
          
          accordion.classList.add(openClass);
          accordion.classList.remove(closeClass);
          accordion.setAttribute('data-state', 'open');
          
          // Set max-height for animation - get the actual content height
          if (content) {
            // First set to auto to measure
            content.style.maxHeight = 'none';
            const scrollHeight = content.scrollHeight;
            content.style.maxHeight = '0px';
            // Force reflow
            content.offsetHeight;
            // Animate to actual height
            requestAnimationFrame(() => {
              content.style.maxHeight = scrollHeight + 'px';
            });
            content.setAttribute("aria-hidden", "false");
          }
          
          if (toggleButton) {
            toggleButton.setAttribute('aria-expanded', 'true');
          }
          
          // Emit custom event
          accordion.dispatchEvent(new CustomEvent('accordion:opened', { 
            detail: { instanceId, config } 
          }));
        } else {
          const openClass = getClassName('open');
          const closeClass = getClassName('close');
          
          accordion.classList.remove(openClass);
          accordion.setAttribute('data-state', 'closed');
          
          // Set max-height to 0 for animation
          if (content) {
            content.style.maxHeight = '0px';
            content.setAttribute("aria-hidden", "true");
          }
          
          if (animate) {
            accordion.classList.add(closeClass);
            // Remove close class after animation
            setTimeout(() => {
              accordion.classList.remove(closeClass);
            }, config.animationDuration);
          }
          
          if (toggleButton) {
            toggleButton.setAttribute('aria-expanded', 'false');
          }
          
          // Emit custom event
          accordion.dispatchEvent(new CustomEvent('accordion:closed', { 
            detail: { instanceId, config } 
          }));
        }
      };
      
      // Helper function to check if accordion is open
      const isOpen = () => {
        const openClass = getClassName('open');
        return accordion.classList.contains(openClass) || accordion.getAttribute('data-state') === 'open';
      };
      
      // Toggle function
      const toggle = () => {
        const isCurrentlyOpen = isOpen();
        
        // Close all other accordions if closePrev is enabled
        if (config.closePrev && !isCurrentlyOpen) {
          this.instances.forEach((otherInstance, otherInstanceId) => {
            if (otherInstanceId !== instanceId && otherInstance.isOpen()) {
              this.close(otherInstanceId);
            }
          });
        }
        
        // Toggle current accordion
        setOpen(!isCurrentlyOpen);
      };
      
      // Click event listener
      const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`Accordion ${instanceId} clicked, currently open:`, isOpen());
        toggle();
      };
      
      // Keyboard event listener
      const handleKeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      };
      
      // Add event listeners
      trigger.addEventListener("click", handleClick);
      trigger.addEventListener("keydown", handleKeydown);
      
      // Create instance object
      const instance = {
        id: instanceId,
        element: accordion,
        trigger: trigger,
        content: content,
        toggleButton: toggleButton,
        config: config,
        setOpen: setOpen,
        toggle: toggle,
        isOpen: isOpen,
        
        // Update configuration
        updateConfig: (newConfig) => {
          instance.config = { ...instance.config, ...newConfig };
        },
        
        // Cleanup method
        destroy: () => {
          trigger.removeEventListener("click", handleClick);
          trigger.removeEventListener("keydown", handleKeydown);
          this.instances.delete(instanceId);
          
          // Remove global methods
          delete window[`openAccordion_${instanceId}`];
          delete window[`closeAccordion_${instanceId}`];
          delete window[`toggleAccordion_${instanceId}`];
        }
      };
      
      // Store instance
      this.instances.set(instanceId, instance);
      
      // Create global convenience methods
      window[`openAccordion_${instanceId}`] = () => this.open(instanceId);
      window[`closeAccordion_${instanceId}`] = () => this.close(instanceId);
      window[`toggleAccordion_${instanceId}`] = () => this.toggle(instanceId);
      
      // Mark as initialized
      accordion.setAttribute("data-initialized", "true");
      
      // Set initial state
      setOpen(config.defaultOpen, false);
      
      return instance;
    },
    
    // Open accordion by instance ID
    open: function(instanceId) {
      const instance = this.instances.get(instanceId);
      if (instance) {
        instance.setOpen(true);
        return true;
      }
      console.warn(`Accordion instance "${instanceId}" not found`);
      return false;
    },
    
    // Close accordion by instance ID
    close: function(instanceId) {
      const instance = this.instances.get(instanceId);
      if (instance) {
        instance.setOpen(false);
        return true;
      }
      console.warn(`Accordion instance "${instanceId}" not found`);
      return false;
    },
    
    // Toggle accordion by instance ID
    toggle: function(instanceId) {
      const instance = this.instances.get(instanceId);
      if (instance) {
        instance.toggle();
        return true;
      }
      console.warn(`Accordion instance "${instanceId}" not found`);
      return false;
    },
    
    // Close all accordions
    closeAll: function() {
      this.instances.forEach((instance, instanceId) => {
        this.close(instanceId);
      });
    },
    
    // Open all accordions
    openAll: function() {
      this.instances.forEach((instance, instanceId) => {
        this.open(instanceId);
      });
    },
    
    // Get instance by ID
    getInstance: function(instanceId) {
      return this.instances.get(instanceId);
    },
    
    // Check if instance exists and is initialized
    exists: function(instanceId) {
      return this.instances.has(instanceId);
    },
    
    // Get all instances
    getAllInstances: function() {
      return Array.from(this.instances.values());
    },
    
    // Get open accordions
    getOpenAccordions: function() {
      return Array.from(this.instances.values()).filter(instance => instance.isOpen());
    },
    
    // Update instance configuration
    updateConfig: function(instanceId, newConfig) {
      const instance = this.instances.get(instanceId);
      if (instance) {
        instance.updateConfig(newConfig);
        return true;
      }
      return false;
    },
    
    // Destroy instance (cleanup)
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
    },
    
    // Utility: Create accordion group behavior
    createGroup: function(instanceIds, options = {}) {
      const groupConfig = {
        allowMultiple: options.allowMultiple || false,
        ...options
      };
      
      if (!groupConfig.allowMultiple) {
        // Ensure only one can be open at a time
        instanceIds.forEach(instanceId => {
          const instance = this.instances.get(instanceId);
          if (instance) {
            instance.updateConfig({ closePrev: true });
          }
        });
      }
      
      return {
        open: (instanceId) => this.open(instanceId),
        close: (instanceId) => this.close(instanceId),
        closeAll: () => instanceIds.forEach(id => this.close(id)),
        openAll: () => instanceIds.forEach(id => this.open(id)),
        getGroup: () => instanceIds.map(id => this.getInstance(id)).filter(Boolean)
      };
    }
  };
  
  // Auto-initialize on DOM ready if needed
  document.addEventListener('DOMContentLoaded', function() {
    // Optional: Auto-initialize all accordions found on page
    // const accordions = document.querySelectorAll('[data-accordion][data-instance]:not([data-initialized="true"])');
    // accordions.forEach(accordion => {
    //   const instanceId = accordion.getAttribute('data-instance');
    //   if (instanceId) {
    //     window.AccordionManager.init(instanceId);
    //   }
    // });
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', function() {
    window.AccordionManager.destroyAll();
  });
  
})();