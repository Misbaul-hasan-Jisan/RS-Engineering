import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar/Navbar'
import LoginSignup from './Pages/LoginSignup'
import Shop from './Pages/Shop'
import ShopCategory from './Pages/ShopCategory'
import Product from './Pages/Product'
import Cart from './Pages/Cart'
import Footer from './component/Footer/Footer'
import electronics_banner from './component/Assets/electronic_banner.webp'
import computer_banner from './component/Assets/computer_banner.webp'
import fashion_banner from './component/Assets/fashion_banner.webp'
import lifestyle_banner from './component/Assets/lifestyle_banner.webp'
import OrderConfirmation from './component/OrderConfirmation/OrderConfirmation'
import MyOrders from './component/MyOrder/MyOrder'
import SearchResults from './Pages/SearchResults'
import Contact from './component/Contact/Contact'
import About from './Pages/About'
import Company from './Pages/Company'
import Store from './Pages/Store'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Shop />} />
        <Route path='/computer' element={<ShopCategory banner={computer_banner} category="computer" />} />
        <Route path='/electronics' element={<ShopCategory banner ={electronics_banner} category="electronics" />} />
        <Route path='/fashion' element={<ShopCategory banner ={fashion_banner} category="fashion" />} />
        <Route path='/lifestyle' element={<ShopCategory banner ={lifestyle_banner} category="lifestyle" />} />
        <Route path='/search-results' element={<SearchResults />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<LoginSignup />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/company" element={<Company />} />
        <Route path="/store" element={<Store />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
