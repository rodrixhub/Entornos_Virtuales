import React from 'react'
import "./Navbar.css"
import logo_black from "../../assets/logo_black.png"
const Navbar = () => {
  return (
    <div className='navbar'> 
    <img src={logo_black} alt="" className='logo'/>
    <ul>
        <li>Biblioteca</li>
        <li>Recursos</li>
        <li>informacion</li>
    </ul>
<div>
    login
</div>
    </div>
  )
}

export default Navbar
