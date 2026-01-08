// Portfolio Mobile Interactive Functions
(function() {
  'use strict';

  // Touch gesture variables for swipe down to close
  let touchStart = 0;
  let touchEnd = 0;

  /**
   * Shows the detail sheet modal
   */
  window.showDetailSheet = function() {
    document.getElementById('detailSheet').classList.add('show');
    document.getElementById('overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  /**
   * Hides the detail sheet modal
   */
  window.hideDetailSheet = function() {
    document.getElementById('detailSheet').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
    document.body.style.overflow = 'auto';
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize swipe down to close detail sheet
    const detailSheet = document.getElementById('detailSheet');
    if (detailSheet) {
      detailSheet.addEventListener('touchstart', function(e) {
        touchStart = e.touches[0].clientY;
      });

      detailSheet.addEventListener('touchmove', function(e) {
        touchEnd = e.touches[0].clientY;
        if (touchEnd - touchStart > 50) {
          detailSheet.style.transform = `translateY(${touchEnd - touchStart}px)`;
        }
      });

      detailSheet.addEventListener('touchend', function(e) {
        if (touchEnd - touchStart > 100) {
          window.hideDetailSheet();
        }
        detailSheet.style.transform = '';
      });
    }

    // Handle tab scrolling
    const tabs = document.querySelector('.tabs-mobile');
    if (tabs) {
      let isDown = false;
      let startX;
      let scrollLeft;

      tabs.addEventListener('touchstart', function(e) {
        isDown = true;
        startX = e.touches[0].pageX - tabs.offsetLeft;
        scrollLeft = tabs.scrollLeft;
      });

      tabs.addEventListener('touchmove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - tabs.offsetLeft;
        const walk = (x - startX) * 2;
        tabs.scrollLeft = scrollLeft - walk;
      });

      tabs.addEventListener('touchend', function() {
        isDown = false;
      });
    }
  });
})();
