import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import './TopNavBar.css'

function TopNavBar({isLoggedIn,logoutUser,cart}) {

    const [menuOpen, setMenuOpen] = useState(false);

    const[query,setQuery]=useState("");

    const [isListening,setIsListening]=useState(false);


    const navigate=useNavigate();

    const handleSearch=()=>{
        if(!query.trim()) return;
        const cleanedQuery = query
            .toLowerCase()
            .replace(/[.,!?]/g, "")
            .trim();
        navigate(`/searched_product?q=${cleanedQuery}`);
    }

    const handleVoiceSearch=()=>{
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if(!SpeechRecognition){
            alert("voice search not supported in this browser");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.start();

        recognition.onstart = ()=> setIsListening(true);

        recognition.onend = ()=> setIsListening(false);

        recognition.onresult = (event)=>{
            let voiceText=event.results[0][0].transcript;

            voiceText = voiceText
                .toLowerCase()
                .replace(/[.,!?]/g, "")
                .trim();

            setQuery(voiceText);

            navigate(`/searched_product?q=${voiceText}`);
        }

        recognition.onerror = (event) => {

            if (event.error === "no-speech") {
                // user didn’t speak → do nothing (silent fail)
                return;
            }

            if (event.error === "not-allowed") {
                alert("Please allow microphone permission");
                return;
            }

        };
        
    }

    const handleLogout = () => {
        logoutUser()

        navigate("/login",{replace:true});
    };


  return (
    <>
        <nav className='navbar p-3'>
            <button className='menu-btn' onClick={()=> setMenuOpen(!menuOpen)}>☰</button>
            <div className='logo'><img src='/localbasket-logo.png' alt='logo'/></div>
            <div className='rightside'>
                <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/my_orders">My Orders</Link></li>
                    <li><Link to="/offers">Offers</Link></li>
                    <li>
                        {
                            isLoggedIn ? (<button className='btn btn-sm' onClick={handleLogout} 
                                style={{backgroundColor:"rgb(255, 106, 0)", color:"white"}}>Logout</button>
                            ) : (<Link to="/login">Login</Link>)
                        }
                    </li>
                </ul>

                <form onSubmit={(e)=>{e.preventDefault();handleSearch()}} className='search-box'>
                    <input type='text' placeholder='search...' value={query} onChange={(e)=>setQuery(e.target.value)}/>
                    <button type='button' className='voice-btn' onClick={handleVoiceSearch}>{isListening ? "🎙️" : "🎤"}</button>

                </form>

                <div className='cart'>
                    <Link to="/cart" className="cart-icon">
                    <img src="/cart.png" className='cart-img' alt='cart-icon'/>
                    {cart.length > 0 && <span className='cart-count'>{cart.length}</span>}
                    </Link>
                </div>

            </div>

        </nav>
    </>

  )
}

export default TopNavBar