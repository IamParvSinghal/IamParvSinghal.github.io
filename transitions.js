const pageOrder = [
    'index.html',
    'table-of-content.html',
    'about-me.html',
    'projects.html',
    'contact-me.html'
];

const transitionOverlay = document.createElement('div');
transitionOverlay.className = 'page-transition';
document.body.appendChild(transitionOverlay);

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || link.target === '_blank') return;

    e.preventDefault();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const targetPage = link.href.split('/').pop();

    const currentIndex = pageOrder.indexOf(currentPage);
    const targetIndex = pageOrder.indexOf(targetPage);
    const direction = targetIndex > currentIndex ? 'left' : 'right';

    transitionPage(link.href, direction);
});

function transitionPage(targetUrl, direction) {
    document.body.classList.add('transitioning');
    
    requestAnimationFrame(() => {
        transitionOverlay.classList.add(`slide-${direction}`);
        
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 200);
    });
}

window.addEventListener('pageshow', (e) => {
    document.body.classList.remove('transitioning');
    transitionOverlay.classList.remove('slide-left', 'slide-right');
}); 