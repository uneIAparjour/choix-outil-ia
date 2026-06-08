(function() {
  var lastHeight = 0;
  function sendHeight() {
    var root = document.getElementById('root');
    if (!root) return;
    var h = Math.max(root.offsetHeight, root.scrollHeight);
    if (h !== lastHeight && h > 0) {
      lastHeight = h;
      window.parent.postMessage({ type: 'iframeResize', height: h }, '*');
    }
  }
  if (window.ResizeObserver) {
    new ResizeObserver(sendHeight).observe(document.getElementById('root'));
  }
  setInterval(sendHeight, 500);
})();
