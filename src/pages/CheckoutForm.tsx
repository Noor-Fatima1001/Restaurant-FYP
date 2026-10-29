import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "../styles/CheckoutForm.css"; 
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAllActiveOrders, handlePayment } from "../redux/cartSlice";
import { usePopup } from "../components/CustomPopup/PopupContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { hideLoader, showLoader } from "../redux/loaderSlice";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const selector = useAppSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const { showPopup } = usePopup();
  const navigate=useNavigate();
  useEffect(() => {
    dispatch(getAllActiveOrders());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      showPopup("Stripe is not initialized yet.");
      setLoading(false);
      return;
    }

    const id = selector.activeOrderId;
    if (!id) {
      showPopup("No active order found.");
      setLoading(false);
      return;
    }

    try {
      dispatch(showLoader());
      await dispatch(handlePayment({ id, stripe, elements, showPopup })).unwrap();
      navigate("/cart")
    } catch (error) {
      dispatch(hideLoader())
      console.error(error);
    } finally {
      dispatch(hideLoader())
      setLoading(false);
    }
  };

  return (
    <div className="checkout-form-page">
      <div className="checkout-form-container">
        <div className="profile-header"   >
        <Logo size={200} />
      </div>
        <div className="checkout-form-box">
          <h2 className="checkout-form-title">Secure Payment</h2>
          <form  className="checkout-form">
            <div className="checkout-card-input">
              <CardElement />
            </div>
            <button onClick={handleSubmit} disabled={!stripe || loading} className="checkout-pay-button">
               Pay Now
            </button>
            <button onClick={()=>navigate("/cart")} className="checkout-pay-button">
                Go Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
