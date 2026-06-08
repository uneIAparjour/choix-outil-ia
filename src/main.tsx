import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// Auto-resize pour iframe WordPress
function sendHeight() {
  const root = document.getElementById('root');
  if (!root) return;
  const height = Math.max(
    root.offsetHeight,
    root.scrollHeight,
    document.body.scrollHeight
  );
  window.parent.postMessage({ type: 'iframeResize', height }, '*');
}

function sendScrollTo(offset = 0) {
  window.parent.postMessage({ type: 'iframeScrollTo', offset }, '*');
}

const observer = new MutationObserver(() => {
  sendHeight();
  sendScrollTo(0);
});
observer.observe(document.getElementById('root')!, { childList: true, subtree: true, attributes: true });
window.addEventListener('resize', sendHeight);
window.addEventListener('load', sendHeight);
setTimeout(sendHeight, 500);
setTimeout(sendHeight, 1500);
