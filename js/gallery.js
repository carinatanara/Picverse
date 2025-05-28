document.addEventListener('DOMContentLoaded', function() {
    const galleryPage = document.querySelector('.gallery-page');
    if (!galleryPage) return;
   
    const filterTags = document.querySelector('.filter-tags');
    const galleryFeeds = document.querySelector('.gallery-feeds');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterTags || !galleryFeeds) return;
    
    const initialItemCount = 8;
    const totalItemCount = 16;
    
    const style = document.createElement('style');
    style.textContent = `
      .gallery-feeds {
        max-height: 650px;
        overflow: hidden;
        transition: max-height 0.3s ease; /* Smoother height transition */
      }
      
      .gallery-item-hidden {
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      
      .gallery-item-hidden.reveal {
        opacity: 1;
        transform: scale(1);
      }
    `;
    document.head.appendChild(style);
    
    galleryItems.forEach((item, index) => {
      if (index >= initialItemCount) {
        item.classList.add('gallery-item-hidden');
      }
    });
    
    if (galleryItems.length < totalItemCount) {
      for (let i = galleryItems.length; i < totalItemCount; i++) {
        const placeholderItem = document.createElement('div');
        placeholderItem.className = 'gallery-item gallery-item-hidden';
        placeholderItem.style.backgroundColor = '#f0f0f0';
        placeholderItem.style.minHeight = '250px';
        placeholderItem.style.borderRadius = '10px';
        galleryFeeds.appendChild(placeholderItem);
      }
    }
    
    const hiddenItems = document.querySelectorAll('.gallery-item-hidden');
    
    let startScrollPos = 150; 
    let endScrollPos = 400;   
    let lastProgress = 0;     
    let itemsRevealed = false; 
    
    function handleScroll() {
      const scrollY = window.scrollY;
      
      let progress = Math.max(0, Math.min(1, (scrollY - startScrollPos) / (endScrollPos - startScrollPos)));
      
      const moveAmount = -60 * progress; 
      galleryFeeds.style.transform = `translateY(${moveAmount}px)`;
      filterTags.style.transform = `translateY(${moveAmount}px)`;
      
      const maxHeightValue = 650 + (1350 * progress); 
      galleryFeeds.style.maxHeight = `${maxHeightValue}px`;
      
      if (progress > 0.3 && !itemsRevealed) {
        itemsRevealed = true;
        hiddenItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('reveal');
          }, 100 * index);
        });
      }
      
      if (progress < 0.2 && itemsRevealed && lastProgress > progress) {
        itemsRevealed = false;
        hiddenItems.forEach((item) => {
          item.classList.remove('reveal');
        });
      }
      
      lastProgress = progress;
    }
    
    window.addEventListener('scroll', handleScroll);
    
    handleScroll();
  });
  
  