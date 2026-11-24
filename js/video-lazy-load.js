/* Load video files only when they are needed, to keep pages light. */
(() => {
  const videos = [...document.querySelectorAll('video')];
  const load = video => {
    const source = video.querySelector('source[data-src], source[src]');
    if (!source) return;
    if (source.hasAttribute('data-src')) {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
      video.load();
    }
    video.play().catch(() => {});
  };
  const heroVideos = videos.filter(v => v.classList.contains('hero-video') || v.classList.contains('page-hero-video'));
  heroVideos.forEach(load);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) load(video);
        else video.pause();
      });
    }, { rootMargin: '180px 0px', threshold: 0.01 });
    videos.filter(v => !heroVideos.includes(v)).forEach(v => observer.observe(v));
  } else {
    videos.forEach(load);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(v => v.pause());
    else heroVideos.forEach(v => v.play().catch(() => {}));
  });
})();
