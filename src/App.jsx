import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ArticlePage } from './pages/ArticlePage'
import { LandingPage } from './pages/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
