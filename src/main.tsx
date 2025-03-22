
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ajouter la classe 'dark' au document par défaut
document.documentElement.classList.add('dark');

createRoot(document.getElementById("root")!).render(<App />);
