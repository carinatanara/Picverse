document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const dots = document.querySelectorAll('.dot');
    const swipeableContent = document.querySelector('.swipeable-content');
    
    let currentTab = 0;
    let startX = 0;
    let isDragging = false;
  
    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        switchTab(index);
      });
    });
  
    swipeableContent.addEventListener('touchstart', handleStart, { passive: true });
    swipeableContent.addEventListener('mousedown', handleStart);
    
    swipeableContent.addEventListener('touchmove', handleMove, { passive: true });
    swipeableContent.addEventListener('mousemove', handleMove);
    
    swipeableContent.addEventListener('touchend', handleEnd, { passive: true });
    swipeableContent.addEventListener('mouseup', handleEnd);
    swipeableContent.addEventListener('mouseleave', handleEnd);
  
    function handleStart(e) {
      isDragging = true;
      startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      swipeableContent.style.cursor = 'grabbing';
    }
  
    function handleMove(e) {
      if (!isDragging) return;
      
      const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const deltaX = startX - currentX;
      
      if (Math.abs(deltaX) > 50) {
        e.preventDefault();
      }
    }
  
    function handleEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      swipeableContent.style.cursor = 'grab';
      
      const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
      const deltaX = startX - endX;
      
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0 && currentTab < tabContents.length - 1) {
          switchTab(currentTab + 1);
        } else if (deltaX < 0 && currentTab > 0) {
          switchTab(currentTab - 1);
        }
      }
    }
  
    function switchTab(index) {
      if (index === currentTab) return;
      
      tabButtons[currentTab].classList.remove('active');
      tabContents[currentTab].classList.remove('active');
      dots[currentTab].classList.remove('active');
      
      currentTab = index;
      
      tabButtons[currentTab].classList.add('active');
      tabContents[currentTab].classList.add('active');
      dots[currentTab].classList.add('active');
    }
  
    swipeableContent.style.cursor = 'grab';
  });