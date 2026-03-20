import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Home from './pages/Home'
import Detail from './pages/Detail'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/food/:id" element={<Detail />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}
