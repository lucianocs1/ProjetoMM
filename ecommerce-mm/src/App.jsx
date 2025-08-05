import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import CookieBanner from './components/CookieBanner/CookieBannerSimple'
import Home from './pages/Home/Home'
import Roupas from './pages/Roupas/Roupas'
import Bolsas from './pages/Bolsas/Bolsas'
import Sapatos from './pages/Sapatos/Sapatos'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roupas" element={<Roupas />} />
          <Route path="/bolsas" element={<Bolsas />} />
          <Route path="/sapatos" element={<Sapatos />} />
        </Routes>
      </Box>
      <Footer />
      <CookieBanner />
    </Box>
  )
}

export default App
