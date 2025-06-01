document.addEventListener('DOMContentLoaded', function() {
  const galleryPage = document.querySelector('.gallery-page');
  if (!galleryPage) return;
 
  const filterTags = document.querySelector('.filter-tags');
  const galleryFeeds = document.querySelector('.gallery-feeds');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalArtist = document.getElementById('modalArtist');
  const modalTags = document.getElementById('modalTags');
  const modalDescription = document.getElementById('modalDescription');
  const closeModal = document.getElementById('closeModal');
  
  if (!filterTags || !galleryFeeds) return;
  
  // Count actual gallery items with images
  const realGalleryItems = Array.from(galleryItems).filter(item => item.querySelector('img'));
  const totalRealItems = realGalleryItems.length;
  const initialItemCount = 8;
  let activeFilter = 'all';
  
  const style = document.createElement('style');
  style.textContent = `
    .gallery-item-hidden {
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .gallery-item-hidden.reveal {
      opacity: 1;
      transform: scale(1);
    }
    
    .gallery-item.filtered-out {
      display: none !important;
    }
    
    .gallery-item.filtered-in {
      display: block;
      opacity: 1;
      transform: scale(1);
      animation: filterIn 0.4s ease;
    }
    
    @keyframes filterIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add "All" button to filter tags
  const allButton = document.createElement('button');
  allButton.className = 'tags active';
  allButton.textContent = 'All';
  allButton.dataset.filter = 'all';
  filterTags.insertBefore(allButton, filterTags.firstChild);
  
  // Set data-filter attributes for existing tag buttons
  const updatedTagButtons = document.querySelectorAll('.tags');
  updatedTagButtons.forEach(button => {
    if (!button.dataset.filter) {
      button.dataset.filter = button.textContent.toLowerCase();
    }
  });
  
  // Only hide items beyond initial count if there are actually more items
  let hiddenItems = [];
  if (totalRealItems > initialItemCount) {
    realGalleryItems.forEach((item, index) => {
      if (index >= initialItemCount) {
        item.classList.add('gallery-item-hidden');
        hiddenItems.push(item);
      }
    });
  }
  
  // Don't add any placeholder items - only work with real items
  
  let startScrollPos = 150; 
  let endScrollPos = 400;   
  let lastProgress = 0;     
  let itemsRevealed = false; 
  let scrollAnimationEnabled = totalRealItems > initialItemCount;
  
  // Filter function
  function filterGallery(filterValue) {
    activeFilter = filterValue;
    
    // Update active tag button
    updatedTagButtons.forEach(button => {
      button.classList.remove('active');
      if (button.dataset.filter === filterValue) {
        button.classList.add('active');
      }
    });
    
    // Filter gallery items
    realGalleryItems.forEach(item => {
      const itemTags = item.dataset.tags || '';
      
      if (filterValue === 'all' || itemTags.includes(filterValue)) {
        item.classList.remove('filtered-out');
        item.classList.add('filtered-in');
      } else {
        item.classList.remove('filtered-in');
        item.classList.add('filtered-out');
      }
    });
    
    // Update grid layout after filtering
    setTimeout(() => {
      updateGridLayout();
    }, 50);
  }
  
  function updateGridLayout() {
    const visibleItems = realGalleryItems.filter(item => 
      !item.classList.contains('filtered-out') && 
      !item.classList.contains('gallery-item-hidden')
    );
    const revealedHiddenItems = hiddenItems.filter(item => 
      item.classList.contains('reveal') && 
      !item.classList.contains('filtered-out')
    );
    const totalVisible = visibleItems.length + revealedHiddenItems.length;
    
    // If no items are visible, keep expanded height for custom content
    if (totalVisible === 0) {
      console.log('🚨 NO ITEMS VISIBLE - Forcing height expansion');
      
      // DISABLE transitions temporarily
      galleryFeeds.style.transition = 'none';
      
      // FORCE the height
      galleryFeeds.style.setProperty('max-height', '2000px', 'important');
      galleryFeeds.style.setProperty('height', 'auto', 'important');
      galleryFeeds.style.setProperty('min-height', '800px', 'important');
      
      // Remove transform that might interfere
      galleryFeeds.style.transform = 'translateY(0px)';
      
      console.log('✅ Forced height applied with transitions disabled');
      return;
    }
    
    // Re-enable transitions for normal filtering
    galleryFeeds.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), max-height 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
    
    // Clear any forced styles from the "no items" state
    galleryFeeds.style.removeProperty('height');
    galleryFeeds.style.removeProperty('min-height');
    
    if (activeFilter === 'all') {
      // Reset to scroll-controlled height for "All" filter
      console.log('🔄 Switched back to "All" - Resetting to scroll control');
      galleryFeeds.style.removeProperty('max-height'); // Remove any forced max-height
      
      handleScroll(); 
    } else {
      const rowsNeeded = Math.ceil(totalVisible / 4);
      const newMaxHeight = Math.max(650, rowsNeeded * 300);
      galleryFeeds.style.setProperty('max-height', `${newMaxHeight}px`, 'important');
      console.log('🔄 Filter active - Height set to:', newMaxHeight);
    }
  }
  
  // Add click event listeners to tag buttons
  updatedTagButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.dataset.filter;
      filterGallery(filterValue);
    });
  });
  
  function handleScroll() {
    // Check if there are any visible items after filtering
    const visibleItems = realGalleryItems.filter(item => 
      !item.classList.contains('filtered-out')
    );
    
    // If no visible items, keep container static but maintain full height
    if (visibleItems.length === 0) {
      galleryFeeds.style.transform = 'translateY(0px)';
      filterTags.style.transform = 'translateY(0px)';
      galleryFeeds.style.maxHeight = '2000px'; // Keep full expanded height
      return;
    }
    
    // Only handle scroll animation if there are actually more items to reveal
    if (!scrollAnimationEnabled) return;
    
    const scrollY = window.scrollY;
    
    let progress = Math.max(0, Math.min(1, (scrollY - startScrollPos) / (endScrollPos - startScrollPos)));
    
    const moveAmount = -60 * progress; 
    galleryFeeds.style.transform = `translateY(${moveAmount}px)`;
    filterTags.style.transform = `translateY(${moveAmount}px)`;
    
    // Only apply scroll-based height changes if no filter is active
    if (activeFilter === 'all') {
      const maxHeightValue = 650 + (1350 * progress); 
      galleryFeeds.style.maxHeight = `${maxHeightValue}px`;
    }
    
    if (progress > 0.3 && !itemsRevealed && hiddenItems.length > 0) {
      itemsRevealed = true;
      hiddenItems.forEach((item, index) => {
        // Only reveal items that aren't filtered out
        if (!item.classList.contains('filtered-out')) {
          setTimeout(() => {
            item.classList.add('reveal');
          }, 100 * index);
        }
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
  
  // Modal functionality
  function openModal(item) {
    const imgSrc = item.querySelector('img').src;
    const title = item.dataset.title || 'Untitled';
    const artist = item.dataset.artist || 'Unknown Artist';
    const tags = item.dataset.tags || '';
    const description = item.dataset.description || 'No description available.';
    
    modalImage.src = imgSrc;
    modalTitle.textContent = title;
    modalArtist.textContent = artist;
    modalDescription.textContent = description;
    
    modalTags.innerHTML = '';
    if (tags) {
      const tagArray = tags.split(',');
      tagArray.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'modal-tag';
        tagElement.textContent = `#${tag.trim()}`;
        modalTags.appendChild(tagElement);
      });
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; 
  }
  
  function closeModalFunc() {
    modal.classList.remove('show');
    document.body.style.overflow = ''; 
  }
  
  // Add click event listeners to gallery items
  realGalleryItems.forEach(item => {
    item.addEventListener('click', () => openModal(item));
  });
  
  // Close modal events
  closeModal.addEventListener('click', closeModalFunc);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModalFunc();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModalFunc();
    }
  });
  
  // Initialize
  window.addEventListener('scroll', handleScroll);
  handleScroll();
  
  // Initialize with all real items visible
  realGalleryItems.forEach(item => {
    item.classList.add('filtered-in');
  });
  
  // If there are 8 or fewer items, ensure they're all visible and disable scroll animation
  if (totalRealItems <= initialItemCount) {
    galleryFeeds.style.maxHeight = '2000px';
    scrollAnimationEnabled = false;

    galleryPage.classList.add('compact');
  }

  galleryFeeds.style.transform = 'translateY(0px)';
});