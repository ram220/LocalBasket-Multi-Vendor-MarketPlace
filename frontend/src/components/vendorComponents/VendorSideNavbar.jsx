import './VendorSideNavbar.css'
import { Link } from 'react-router-dom'
function VendorSideNavbar(){
    return(
        <>
            <div className="sidenav p-4 " style={{backgroundColor:"whitesmoke"}}>
                <div className='back mt-3'> 
                    <Link to="/vendor/add_product"><strong><h6>Add Product</h6></strong></Link>
                </div>
                <div className='back mt-3'>
                    <Link to="/vendor/view_products"><strong><h6>View Products</h6></strong></Link>
                </div>
                <div className='back mt-3'>
                    <Link to="/vendor/view_orders"><strong><h6>View Orders</h6></strong></Link>
                </div>
                <div className='back mt-3'>
                    <Link to="/vendor/total_income"><strong><h6>Profitability</h6></strong></Link>
                </div>
            </div>
        </>
    )
}
export default VendorSideNavbar