// Lazy Loading Implementation
document.addEventListener("DOMContentLoaded", function() {
  // Check if browser supports Intersection Observer
  if ('IntersectionObserver' in window) {
    // Configure the observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      // Set initial opacity to 0 if not already set
      if (!img.classList.contains('loaded')) {
        img.style.opacity = '0';
      }
      imageObserver.observe(img);
    });

    // Handle load event for smooth transition
    lazyImages.forEach(img => {
      img.addEventListener('load', function() {
        this.style.opacity = '1';
        this.classList.add('loaded');
      });
    });

  } else {
    // Fallback for browsers without Intersection Observer
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src || img.src;
      img.classList.add('loaded');
      img.style.opacity = '1';
    });
  }
});