import "../Styles/cart.css";
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';
import food_container from "../assets/food_container.png"
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckOut from "./Checkout.js";

const API = process.env.REACT_APP_API_URL;

function Cart({ carts, setCarts, setCheckedOut}) {
  let navigate = useNavigate();
  const userID = localStorage.getItem("userID");


  useEffect(() => {
    axios
      .get(`${API}/carts/${userID}/active`)
      .then((res) => {
        if(res.data.Error){

        }else{
          setCarts(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userID]);


  const handleDelete = (item) => {
    axios.delete(`${API}/customers/${userID}/deleteItem`)
    .then((res) => {
      window.alert("The item has been removed")
    })
    .catch((err) =>{
      console.log(err);
    });
  };
  
  const handleCheckout = () => {

    axios.put(`${API}/carts/submit`, {userID})
    .then((res) => {
      setCarts(res.data)
      navigate(`/carts/inactive`)
    })
    .catch((err) => {
      console.log(err)
    })
    
  }

  console.log(carts)

  const activeCart = carts?.map((product) => {
    return (
      <div key={product.orderNumber} className="active-cart">
        <div id="order-details">
          <div id="order-num">Order: #{product.orderNumber}</div>
          
          {product.items.map((item) => {
            return (
              <div key={item.id} className="meal-container">
                <CancelIcon/>
                  <img id="food-img" src={food_container} alt="food icon"/>
                <div className="restaurant-name"><b>{product.restaurant}</b></div>
                <div className="meal-details">
                  <p><b>Dietary Restriction: </b>{item.name}</p>
                  <div id="quantity">
                    <b>Quantity:</b> <input type="number" id="quantity" name="quantity" min="1" max={item.quantity}/>
                  </div>
                  {/* <button id="delete-item-btn" onClick={()=>handleDelete(item)}>Delete</button> */}
                </div>
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <div className="cart-container">

      <div>
        {activeCart.length < 1 ? (
          <div className="active-empty-cart">          
          <Link to="/"> Start your order </Link>
          </div>
          ): (
            <div className="active-cart-check">
             <div>
             {activeCart}
             </div>
             
             <CheckOut carts={carts} handleCheckout={handleCheckout}/>
           {/* <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>  */}
           </div>
        )}
        
        
      </div>
    </div>
  );
}

export default Cart;