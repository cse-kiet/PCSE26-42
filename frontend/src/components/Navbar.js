import react from 'react'
import  {Link} from 'react-router-dom'
import "../styles/navbar.css"
export default function Navbar(){
    return(
    <div >
        <div className="nav">  <a href="/">Home</a>
            <a href="#">About us</a>
            <a href="#">Services</a>
            <a href="#">Contact Us</a>
            <a href="/login"className="right">Login</a>
            </div>
    </div>       
    )
}