import React from 'react'
import TopNavBar from '../components/userComponents/TopNavBar'
import { Outlet } from 'react-router-dom'
import Chatbot from '../pages/userPages/Chatbot'

function UserLayout({isLoggedIn,logoutUser,cart,setCart,fetchCart}) {
  return (
    <>
        <TopNavBar isLoggedIn={isLoggedIn} logoutUser={logoutUser} cart={cart}/>
        <Chatbot setCart={setCart}/>
        <div>
            <Outlet context={{fetchCart}}/>
        </div>
    
    </>
  )
}

export default UserLayout