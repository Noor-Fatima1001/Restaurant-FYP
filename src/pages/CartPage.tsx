import '../styles/CartPage.css';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { removeFromCart, getAllActiveOrders, placeOrder, clearCart, updateOrder } from '../redux/cartSlice';
import { usePopup } from '../components/CustomPopup/PopupContext';
import { useEffect } from 'react';
import { PlaceOrderProduct } from '../types/interface';
import { useNavigate } from 'react-router-dom';
import { removeProduct } from '../redux/productsSlice';
import { fetchProfile } from '../redux/ProfileSlice';
import { hideLoader, showLoader } from '../redux/loaderSlice';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { showPopup, hidePopup } = usePopup();
  const cartItems = useAppSelector((state) => state.cart.items);
  const currentActiveOrders = useAppSelector((state) => state.cart.currentActiveOrders);
  const currencySymbol = useAppSelector((state) => state.cart.currencySymbol);
  const { profileData } = useAppSelector((state) => state.profile);
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.specialPrice ? parseFloat(item.specialPrice) || 0 : parseFloat(item.price) || 0;
    const quantity = item.quantity || 1;
    return total + price * quantity;
  }, 0).toFixed(2);

  useEffect(() => {
    if (cartItems.length <= 0) {
      navigate('/welcome');
    }
  }, [cartItems.length, navigate]);

  useEffect(() => {
    dispatch(getAllActiveOrders());
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
    dispatch(removeProduct(id));
  };

  const handlePayOnline = () => {
    hidePopup();
    navigate('/checkout');
  };

  const handleCOD = () => {
    showPopup(<div>Order Placed Successfully with COD!</div>);
    navigate('/welcome');
  };

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      showPopup('Please select at least one item');
      return;
    }

    const products: PlaceOrderProduct[] = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    dispatch(showLoader());

    try {
      if (currentActiveOrders?.status === 'pending') {
        await dispatch(updateOrder({ orderId: currentActiveOrders.id, products}));
        const paymentOpt =
          profileData?.userType === 'Guest'
            ? 'Order Placed successfully'
            : (
              <div className="cart-CheckOut-button-container">
                <div>
                  <div>Order Placed Successfully!</div>
                  <button onClick={handleCOD}>Cash On Delivery</button>
                  <button onClick={handlePayOnline}>Pay Online</button>
                </div>
              </div>
            );

        showPopup(paymentOpt, false);
        dispatch(clearCart()); 
        dispatch(getAllActiveOrders());
      } else {
        await dispatch(placeOrder({ products, showPopup })).unwrap();

        const paymentOpt =
          profileData?.userType === 'Guest'
            ? 'Order Placed successfully'
            : (
              <div className="cart-CheckOut-button-container">
                <div>
                  <div>Order Placed Successfully!</div>
                  <button onClick={handleCOD}>Cash On Delivery</button>
                  <button onClick={handlePayOnline}>Pay Online</button>
                </div>
              </div>
            );

        showPopup(paymentOpt, false);
        dispatch(clearCart());
        dispatch(getAllActiveOrders());
      }
    } catch (err) {
      console.error('Order placement error:', err);
      showPopup('Failed to place order. Please try again.');
    } finally {
      dispatch(hideLoader());
      dispatch(clearCart());
      dispatch(getAllActiveOrders());
      navigate("/welcome")
    }
  };



  return (
    <div className="cart-container">
      <div className="cart-header">Your Cart</div>
      <div className="cart-listContainer">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-cartItem">
            <div className="cart-itemDetails">
              <div className="cart-name">{item.name}</div>
              <div className="cart-price">
                <div>Category: {item.category}</div>
                {item.specialPrice ? (
                  <div>
                    {currencySymbol} {parseFloat(item.specialPrice).toFixed(2)} x {item.quantity} =
                    {currencySymbol} {(parseFloat(item.specialPrice) * item.quantity).toFixed(2)}
                  </div>
                ) : (
                  <div>
                    {currencySymbol} {parseFloat(item.price).toFixed(2)} x {item.quantity} =
                    {currencySymbol} {(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            <div className="cart-button-container">
              <button className="cart-removeButton" onClick={() => handleRemoveItem(item.id)}>X</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="cart-totalContainer">
          <span className="cart-totalText">Total: {currencySymbol} {totalPrice}</span>
          <button className="confirm-order-button" onClick={handlePlaceOrder}>
            {currentActiveOrders?.status === 'pending' ? 'Add items to Ongoing Order' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
