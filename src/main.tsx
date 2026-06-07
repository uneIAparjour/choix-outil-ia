import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// Auto-resize pour iframe WordPress
function sendHeight() {
  const root = document.getElementById('root');
  if (!root) return;
  const height = root.offsetHeight;
  window.parent.postMessage({ type: 'resize', height }, '*');
}

const observer = new MutationObserver(sendHeight);
observer.observe(document.getElementById('root')!, { childList: true, subtree: true, attributes: true });
window.addEventListener('resize', sendHeight);
window.addEventListener('load', sendHeight);
setTimeout(sendHeight, 500);
