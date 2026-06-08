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

const observer = new MutationObserver(sendHeight);
observer.observe(document.getElementById('root')!, { childList: true, subtree: true, attributes: true });
window.addEventListener('resize', sendHeight);
window.addEventListener('load', sendHeight);
setTimeout(sendHeight, 500);
setTimeout(sendHeight, 1500);
