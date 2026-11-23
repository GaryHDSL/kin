/* Load video files only when they are needed, to keep pages light. */
(() => {
  const videos = [...document.querySelectorAll('video')];
  const load = video => {
    const source = video.querySelector('source[data-src]');
    if (!source || source.src) return;
    source.src = source.dataset.src;
    source.removeAttribute('data-src');
    video.load();
    const play = () => video.play().catch(() => {});
    if (video.readyState >= 2) play();
    else video.addEventListener('canplay', play, { once: true });
  };
  const heroVideos = videos.filter(v => v.classList.contains('hero-video') || v.classList.contains('page-hero-video'));
  heroVideos.forEach(load);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) load(video);
        else if (video.readyState > 0) video.pause();
      });
    }, { rootMargin: '180px 0px', threshold: 0.01 });
    videos.filter(v => !heroVideos.includes(v)).forEach(v => observer.observe(v));
  } else {
    videos.forEach(load);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(v => v.pause());
    else videos.filter(v => v.classList.contains('hero-video') || v.classList.contains('page-hero-video')).forEach(v => v.play().catch(() => {}));
  });
})();
