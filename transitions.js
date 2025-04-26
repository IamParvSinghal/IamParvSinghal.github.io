// Page order for determining transition direction
const pageOrder = [
    'index.html',
    'table-of-content.html',
    'about-me.html',
    'projects.html',
    'contact-me.html'
];

// Create transition overlay
const transitionOverlay = document.createElement('div');
transitionOverlay.className = 'page-transition';
document.body.appendChild(transitionOverlay);

// Handle all link clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || link.target === '_blank') return; // Skip external links

    e.preventDefault();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const targetPage = link.href.split('/').pop();

    // Determine transition direction
    const currentIndex = pageOrder.indexOf(currentPage);
    const targetIndex = pageOrder.indexOf(targetPage);
    const direction = targetIndex > currentIndex ? 'left' : 'right';

    // Apply transition
    transitionPage(link.href, direction);
});

function transitionPage(targetUrl, direction) {
    // Add transitioning class to body immediately
    document.body.classList.add('transitioning');
    
    // Short delay to ensure fade out starts
    requestAnimationFrame(() => {
        // Add the slide animation class
        transitionOverlay.classList.add(`slide-${direction}`);
        
        // Wait for fade out and start of slide
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 200);
    });
}

// Handle page load
window.addEventListener('pageshow', (e) => {
    // Remove all transition-related classes
    document.body.classList.remove('transitioning');
    transitionOverlay.classList.remove('slide-left', 'slide-right');
}); 