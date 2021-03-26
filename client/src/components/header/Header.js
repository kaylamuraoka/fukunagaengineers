import React from 'react'
import { Link } from "react-router-dom"
import "./header.css"

const Header = () => {
  return (
    <header>
      <div className="logo">
        <h1><Link to="/">Fukunaga Engineers</Link></h1>
      </div>

      <ul>
        <li><Link to="/"><i class="fas fa-shopping-cart"></i> Cart</Link></li>
        <li><Link to="/login"><i class="fas fa-user"></i> Sign in</Link></li>
      </ul>
    </header>
  )
}

export default Header
