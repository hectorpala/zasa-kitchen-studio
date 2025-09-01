class GoogleReviews {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.apiUrl = options.apiUrl || '/api/reviews';
    this.maxReviews = options.maxReviews || 3;
    this.showRating = options.showRating !== false;
    
    if (!this.container) {
      console.error(`Container with ID "${containerId}" not found`);
      return;
    }
    
    this.init();
  }

  async init() {
    try {
      this.showLoading();
      const data = await this.fetchReviews();
      this.render(data);
    } catch (error) {
      console.error('Error loading Google reviews:', error);
      this.showError();
    }
  }

  async fetchReviews() {
    const response = await fetch(this.apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  showLoading() {
    this.container.innerHTML = `
      <div class="google-reviews-loading">
        <div class="spinner"></div>
        <p>Cargando reseñas...</p>
      </div>
    `;
  }

  showError() {
    this.container.innerHTML = `
      <div class="google-reviews-error">
        <p>Error al cargar las reseñas. <a href="https://www.google.com/maps/place/?q=place_id:ChIJaeFvFXtVYXsRCt0LqoLgqgE" target="_blank">Ver en Google</a></p>
      </div>
    `;
  }

  render(data) {
    const reviewsToShow = data.reviews.slice(0, this.maxReviews);
    
    let html = `
      <div class="google-reviews">
        ${this.showRating ? `
          <div class="google-reviews-header">
            <div class="google-rating">
              <span class="rating-score">${data.rating}</span>
              <div class="rating-stars">${this.generateStars(data.rating)}</div>
              <span class="rating-count">(${data.reviewCount} reseñas)</span>
            </div>
          </div>
        ` : ''}
        
        <div class="reviews-grid">
          ${reviewsToShow.map(review => `
            <div class="review-card">
              <div class="review-header">
                <div class="review-author">
                  <strong>${this.escapeHtml(review.author)}</strong>
                </div>
                <div class="review-rating">
                  ${this.generateStars(review.rating)}
                </div>
              </div>
              <div class="review-text">
                <p>${this.escapeHtml(review.text || 'Sin comentario')}</p>
              </div>
              <div class="review-time">
                <small>${review.relativeTime}</small>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="google-reviews-footer">
          <a href="${data.googleUrl}" target="_blank" rel="noopener" class="btn-google">
            Ver más reseñas en Google
          </a>
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Función global para inicializar fácilmente
window.initGoogleReviews = function(containerId, options) {
  return new GoogleReviews(containerId, options);
};