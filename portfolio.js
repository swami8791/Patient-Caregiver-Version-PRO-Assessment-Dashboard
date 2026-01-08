// Portfolio Mobile Interactive Functions

// Touch gesture variables for swipe down to close
let touchStart = 0;
let touchEnd = 0;

/**
 * Shows the detail sheet modal
 */
function showDetailSheet() {
  document.getElementById('detailSheet').classList.add('show');
  document.getElementById('overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

/**
 * Hides the detail sheet modal
 */
function hideDetailSheet() {
  document.getElementById('detailSheet').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Initialize swipe down to close detail sheet
const detailSheet = document.getElementById('detailSheet');
detailSheet.addEventListener('touchstart', e => {
  touchStart = e.touches[0].clientY;
});

detailSheet.addEventListener('touchmove', e => {
  touchEnd = e.touches[0].clientY;
  if (touchEnd - touchStart > 50) {
    detailSheet.style.transform = `translateY(${touchEnd - touchStart}px)`;
  }
});

detailSheet.addEventListener('touchend', e => {
  if (touchEnd - touchStart > 100) {
    hideDetailSheet();
  }
  detailSheet.style.transform = '';
});

// Handle tab scrolling
const tabs = document.querySelector('.tabs-mobile');
let isDown = false;
let startX;
let scrollLeft;

tabs.addEventListener('touchstart', (e) => {
  isDown = true;
  startX = e.touches[0].pageX - tabs.offsetLeft;
  scrollLeft = tabs.scrollLeft;
});

tabs.addEventListener('touchmove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.touches[0].pageX - tabs.offsetLeft;
  const walk = (x - startX) * 2;
  tabs.scrollLeft = scrollLeft - walk;
});

tabs.addEventListener('touchend', () => {
  isDown = false;
});
