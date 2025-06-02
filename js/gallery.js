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

  function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  const filterFromURL = getURLParameter('filter');
  
  const realGalleryItems = Array.from(galleryItems).filter(item => item.querySelector('img'));
  const totalRealItems = realGalleryItems.length;
  const initialItemCount = 8;
  let activeFilter = filterFromURL || 'all';
  
  const style = document.createElement('style');
  style.textContent = `
    .gallery-feeds {
      animation: none !important;
    }
    
    .gallery-feeds.reset-container {
      max-height: 650px !important;
      transform: translateY(0px) !important;
      transition: transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), max-height 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
    }
    
    .gallery-item-hidden {
      opacity: 0 !important;
      transform: scale(0.95) !important;
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .gallery-item-hidden.reveal {
      opacity: 1 !important;
      transform: scale(1) !important;
      animation: revealItem 0.6s ease forwards;
    }
    
    .gallery-item:not(.gallery-item-hidden):hover {
      transform: translateY(-5px) !important;
    }
    
    .gallery-item-hidden:hover {
      transform: scale(0.95) !important;
    }
    
    .gallery-item-hidden.reveal:hover {
      transform: scale(1) translateY(-5px) !important; 
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
    
    @keyframes revealItem {
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
  
  const allButton = document.createElement('button');
allButton.className = filterFromURL ? 'tags' : 'tags active'; 
allButton.textContent = 'All';
allButton.dataset.filter = 'all';
filterTags.insertBefore(allButton, filterTags.firstChild);
  
  const updatedTagButtons = document.querySelectorAll('.tags');
  updatedTagButtons.forEach(button => {
    if (!button.dataset.filter) {
      button.dataset.filter = button.textContent.toLowerCase();
    }
  });

  if (filterFromURL) {
    setTimeout(() => {
      filterGallery(filterFromURL);
    }, 100);
  }
  
  let hiddenItems = [];
  if (totalRealItems > initialItemCount) {
    realGalleryItems.forEach((item, index) => {
      if (index >= initialItemCount) {
        item.classList.add('gallery-item-hidden');
        hiddenItems.push(item);
      }
    });
  }
  
  let startScrollPos = 150; 
  let endScrollPos = 400;   
  let lastProgress = 0;     
  let itemsRevealed = false; 
  let scrollAnimationEnabled = totalRealItems > initialItemCount;
  
  function filterGallery(filterValue) {
    activeFilter = filterValue;
    
    updatedTagButtons.forEach(button => {
      button.classList.remove('active');
      if (button.dataset.filter === filterValue) {
        button.classList.add('active');
      }
    });
    
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
    
    const visibleAfterFilter = realGalleryItems.filter(item => 
      !item.classList.contains('filtered-out')
    );
    
    if (visibleAfterFilter.length <= initialItemCount) {
      visibleAfterFilter.forEach(item => {
        item.classList.remove('gallery-item-hidden');
        item.classList.add('reveal');
      });
      itemsRevealed = true;
    } else {
      realGalleryItems.forEach((item, index) => {
        if (index >= initialItemCount && !item.classList.contains('filtered-out')) {
          item.classList.add('gallery-item-hidden');
          item.classList.remove('reveal');
        }
      });
      itemsRevealed = false;
    }
    
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
    
    if (totalVisible === 0) {
      galleryFeeds.style.transition = 'none';
      galleryFeeds.style.setProperty('max-height', '2000px', 'important');
      galleryFeeds.style.setProperty('height', 'auto', 'important');
      galleryFeeds.style.setProperty('min-height', '800px', 'important');
      galleryFeeds.style.transform = 'translateY(0px)';
      return;
    }
    
    if (activeFilter === 'all') {
      galleryFeeds.removeAttribute('style');
      
      galleryFeeds.classList.add('reset-container');
      
      realGalleryItems.forEach((item, index) => {
        if (index >= initialItemCount) {
          item.classList.add('gallery-item-hidden');
          item.classList.remove('reveal');
        }
      });
      itemsRevealed = false;
      
      setTimeout(() => {
        handleScroll();
      }, 50);
      
    } else {
      galleryFeeds.classList.remove('reset-container');
      galleryFeeds.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), max-height 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
      galleryFeeds.style.removeProperty('height');
      galleryFeeds.style.removeProperty('min-height');
      
      const rowsNeeded = Math.ceil(totalVisible / 4);
      const newMaxHeight = Math.max(650, rowsNeeded * 300);
      galleryFeeds.style.setProperty('max-height', `${newMaxHeight}px`, 'important');
      galleryFeeds.style.setProperty('transform', 'translateY(0px)', 'important');
    }
  }
  
  updatedTagButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.dataset.filter;
      filterGallery(filterValue);
    });
  });
  
  function handleScroll() {
    const visibleItems = realGalleryItems.filter(item => 
      !item.classList.contains('filtered-out')
    );
    
    if (visibleItems.length === 0) {
      galleryFeeds.style.transform = 'translateY(0px)';
      filterTags.style.transform = 'translateY(0px)';
      galleryFeeds.style.maxHeight = '2000px'; 
      return;
    }
    
    if (!scrollAnimationEnabled || activeFilter !== 'all') return;
    
    const scrollY = window.scrollY;
    
    let progress = Math.max(0, Math.min(1, (scrollY - startScrollPos) / (endScrollPos - startScrollPos)));
    
    const moveAmount = -60 * progress; 
    
    if (progress > 0) {
      galleryFeeds.classList.remove('reset-container');
    }
    
    galleryFeeds.style.transform = `translateY(${moveAmount}px)`;
    filterTags.style.transform = `translateY(${moveAmount}px)`;
    
    const maxHeightValue = 650 + (1350 * progress); 
    galleryFeeds.style.maxHeight = `${maxHeightValue}px`;
    
    if (progress > 0.1 && !itemsRevealed && hiddenItems.length > 0) {
      itemsRevealed = true;
      hiddenItems.forEach((item, index) => {
        if (!item.classList.contains('filtered-out')) {
          setTimeout(() => {
            item.classList.add('reveal');
          }, 150 * index); 
        }
      });
    }
    
    if (progress < 0.05 && itemsRevealed && lastProgress > progress) {
      itemsRevealed = false;
      hiddenItems.forEach((item) => {
        item.classList.remove('reveal');
      });
      
      if (progress === 0) {
        galleryFeeds.classList.add('reset-container');
      }
    }
    
    lastProgress = progress;
  }
  
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
  
  realGalleryItems.forEach(item => {
    item.addEventListener('click', () => openModal(item));
  });
  
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
  
  window.addEventListener('scroll', handleScroll);
  
  realGalleryItems.forEach(item => {
    item.classList.add('filtered-in');
  });
  
  if (totalRealItems <= initialItemCount) {
    galleryFeeds.style.maxHeight = '2000px';
    scrollAnimationEnabled = false;
    galleryPage.classList.add('compact');
  } else {
    galleryFeeds.style.maxHeight = '650px';
  }

  galleryFeeds.style.transform = 'translateY(0px)';
  
  setTimeout(() => {
    handleScroll();
  }, 50);
});