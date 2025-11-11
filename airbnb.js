document.addEventListener('DOMContentLoaded', function() {
    // Initialize all carousels on the page
    const carousels = document.querySelectorAll('.carousel-wrapper');
    
    carousels.forEach(carousel => {
        const prevBtn = carousel.querySelector('.arrow');
        const nextBtn = carousel.querySelector('.second-arrow');
        const scrollRow = carousel.closest('.rail').querySelector('.scroll-row');
        const scrollRowItems = scrollRow.querySelectorAll('.stay-card');
        
        // Set initial state
        let currentPosition = 0;
        let itemsPerView = Math.floor(scrollRow.offsetWidth / 300) || 1; // Adjust 300 based on your card width
        const itemWidth = scrollRowItems[0]?.offsetWidth || 300; // Default to 300px if not found
        const totalItems = scrollRowItems.length;
        const maxPosition = Math.max(0, totalItems - itemsPerView) * itemWidth;
        
        // Update items per view on window resize
        function updateItemsPerView() {
            itemsPerView = Math.floor(scrollRow.offsetWidth / itemWidth) || 1;
            currentPosition = Math.min(currentPosition, Math.max(0, totalItems - itemsPerView) * itemWidth);
            scrollRow.scrollTo({
                left: currentPosition,
                behavior: 'smooth'
            });
        }
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateItemsPerView, 100);
        });
        
        // Navigation functions
        function scrollToPosition(position) {
            currentPosition = position;
            scrollRow.scrollTo({
                left: currentPosition,
                behavior: 'smooth'
            });
            updateButtonStates();
        }
        
        function updateButtonStates() {
            if (prevBtn) {
                prevBtn.style.opacity = currentPosition <= 0 ? '0.5' : '1';
                prevBtn.disabled = currentPosition <= 0;
            }
            if (nextBtn) {
                nextBtn.style.opacity = currentPosition >= maxPosition ? '0.5' : '1';
                nextBtn.disabled = currentPosition >= maxPosition;
            }
        }
        
        // Event listeners for navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentPosition = Math.max(0, currentPosition - (itemsPerView * itemWidth));
                scrollToPosition(currentPosition);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentPosition = Math.min(maxPosition, currentPosition + (itemsPerView * itemWidth));
                scrollToPosition(currentPosition);
            });
        }
        
        // Initialize button states
        updateButtonStates();
        
        // Add touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        scrollRow.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        scrollRow.addEventListener('touchend', (e) => {
            if (!touchStartX) return;
            
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            // Only consider it a swipe if the movement is significant enough
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentPosition < maxPosition) {
                    // Swipe left - go to next
                    currentPosition = Math.min(maxPosition, currentPosition + (itemsPerView * itemWidth));
                } else if (diff < 0 && currentPosition > 0) {
                    // Swipe right - go to previous
                    currentPosition = Math.max(0, currentPosition - (itemsPerView * itemWidth));
                }
                scrollToPosition(currentPosition);
            }
            
            touchStartX = 0;
            touchEndX = 0;
        }, { passive: true });
    });
    
    // Initialize any other carousels with the same class
    const otherCarousels = document.querySelectorAll('.scroll-row:not(.rail .scroll-row)');
    otherCarousels.forEach(scrollRow => {
        scrollRow.style.overflowX = 'auto';
        scrollRow.style.scrollBehavior = 'smooth';
        scrollRow.style.scrollSnapType = 'x mandatory';
        scrollRow.style.msOverflowStyle = 'none';
        scrollRow.style.scrollbarWidth = 'none';
    });
});