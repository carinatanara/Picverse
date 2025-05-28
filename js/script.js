// HERO SLIDESHOW
const artNames = [
    "Water Lilies",
    "The Starry Night",
    "The Persistence of Memory"
];

const artistNames = [
    "Claude Monet", 
    "Sophia Chen",  
    "James Wilson"  
];

let slideIndex = 0;
showSlides();

function initSlideshow() {
  const slides = document.getElementsByClassName("slidefade");
  const artistDescElement = document.querySelector(".artist-desc");
  
  if (slides.length > 0 && artistDescElement) {
      showSlides();
  }
}

function showSlides() {
  const slides = document.getElementsByClassName("slidefade");
  const artistDescElement = document.querySelector(".artist-desc");
  
  if (!slides.length || !artistDescElement) return;
  
  for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove("active");
  }
  
  slideIndex++;
  if (slideIndex > slides.length) {
      slideIndex = 1;
  }
  
  slides[slideIndex - 1].classList.add("active");
  
  if (slideIndex <= artNames.length && slideIndex <= artistNames.length) {
      artistDescElement.textContent = artNames[slideIndex - 1] + " by " + artistNames[slideIndex - 1];
  }

  setTimeout(showSlides, 5000);
}

// LIKE LOGIC
document.addEventListener('DOMContentLoaded', function() {
  const likeContainers = document.querySelectorAll('.like-container');
  
  const savedLikes = JSON.parse(localStorage.getItem('picverseLikes') || '{}');
  
  likeContainers.forEach((container, index) => {
    const heartIcon = container.querySelector('.heart-icon');
    const likeCountElement = container.querySelector('.like-count');
    
    const artworkTitle = container.closest('.artwork-card').querySelector('.artwork-title').textContent;
    const likeId = `artwork-${artworkTitle.replace(/\s+/g, '-').toLowerCase()}`;
    
    let likeCount = parseInt(likeCountElement.textContent.replace(/,/g, ''));
    
    let isLiked = savedLikes[likeId] === true;
    
    if (isLiked) {
      heartIcon.setAttribute('fill', '#205781');
      heartIcon.classList.add('liked');
    }
    
    heartIcon.addEventListener('click', function() {
      if (!isLiked) {
        likeCount++;
        heartIcon.setAttribute('fill', '#205781');
        heartIcon.classList.add('liked');
        isLiked = true;

        likeCountElement.classList.add('bump');
        setTimeout(() => {
          likeCountElement.classList.remove('bump');
        }, 300);
      } else {
        likeCount--;
        heartIcon.setAttribute('fill', 'none');
        heartIcon.classList.remove('liked');
        isLiked = false;
      }
      

      likeCountElement.textContent = likeCount.toLocaleString();
      
      savedLikes[likeId] = isLiked;
      localStorage.setItem('picverseLikes', JSON.stringify(savedLikes));
    });
  });
});

// HORIZONTAL SCROLL
document.addEventListener('DOMContentLoaded', function() {
  const artworkGrid = document.querySelector('.artwork-grid');
  
  if (!artworkGrid) {
    console.error('Artwork grid not found!');
    return;
  }
  
  console.log('Nuclear option initializing');
  
  artworkGrid.style = '';
  
  const forcedStyle = document.createElement('style');
  forcedStyle.textContent = `
    .featured-section {
      overflow-x: hidden !important;
      position: relative !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    
    .artwork-grid {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      overflow-x: scroll !important;
      overflow-y: hidden !important;
      white-space: nowrap !important;
      width: 100% !important;
      padding: 0 2rem 4rem 2rem !important;
      margin-top: -370px !important;
      position: relative !important;
      z-index: 10 !important;
      cursor: grab !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    
    .artwork-grid::-webkit-scrollbar {
      display: none !important;
    }
    
    .artwork-card {
      flex: 0 0 auto !important;
      width: 280px !important;
      margin-right: 24px !important;
    }
  `;
  document.head.appendChild(forcedStyle);
  
  const artworkCards = artworkGrid.querySelectorAll('.artwork-card');
  artworkCards.forEach(card => {
    card.style.cssText = 'flex: 0 0 auto !important; width: 280px !important; margin-right: 24px !important;';
  });
  
  function wheelHandler(e) {
    e.preventDefault();
    artworkGrid.scrollLeft += e.deltaY;
    e.stopPropagation();
    return false;
  }
  
  artworkGrid.addEventListener('wheel', wheelHandler, { passive: false });
  artworkGrid.addEventListener('mousewheel', wheelHandler, { passive: false });
  artworkGrid.addEventListener('DOMMouseScroll', wheelHandler, { passive: false });
  
  let isDown = false;
  let startX;
  let scrollLeft;
  
  artworkGrid.addEventListener('mousedown', function(e) {
    isDown = true;
    artworkGrid.style.cursor = 'grabbing';
    startX = e.pageX - artworkGrid.offsetLeft;
    scrollLeft = artworkGrid.scrollLeft;
    e.preventDefault();
  });
  
  artworkGrid.addEventListener('mouseleave', function() {
    isDown = false;
    artworkGrid.style.cursor = 'grab';
  });
  
  artworkGrid.addEventListener('mouseup', function() {
    isDown = false;
    artworkGrid.style.cursor = 'grab';
  });
  
  artworkGrid.addEventListener('mousemove', function(e) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - artworkGrid.offsetLeft;
    const walk = (x - startX);
    artworkGrid.scrollLeft = scrollLeft - walk;
  });
  
  setTimeout(() => {
    artworkGrid.scrollLeft = 100;
    console.log('Forced scroll applied');
  }, 1000);
  
  console.log('Nuclear option initialized - without arrow buttons');
});

