
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Le thème sera géré par le hook useTheme
// et appliqué automatiquement selon la préférence enregistrée

createRoot(document.getElementById("root")!).render(<App />);
