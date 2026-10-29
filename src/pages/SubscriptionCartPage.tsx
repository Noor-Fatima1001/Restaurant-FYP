// CartPage.tsx
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { placeFreeOrder, removeFromCart } from '../redux/subscriptionsSlice';
import { usePopup } from '../components/CustomPopup/PopupContext';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/interface';


const SubscriptionCartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showPopup } = usePopup();

  const { cart, loading, error } = useAppSelector((state) => state.subscriptions);

  const handlePlaceOrder = async () => {
    try {
      await dispatch(placeFreeOrder()).unwrap();
      showPopup('Free order placed successfully!');
      navigate('/'); // Or to order confirmation page
    } catch (err: any) {
      showPopup(err || 'Error placing order. Please try again.');
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
    showPopup('Item removed from cart.');
  };

  return (
    <div className="cart-page">
      <div className="cart-header">Shopping Cart</div>
      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {cart.length === 0 ? (
        <div className="empty-cart">Your cart is empty. <button onClick={() => navigate('/free-products')}>Browse Free Products</button></div>
      ) : (
        <div className="cart-container">
          {cart.map((product: Product) => (
            <div key={product.id} className="cart-item">
              <div className="cart-item-name">{product.name}</div>
              <div className="cart-item-description">{product.description}</div>
              <div className="cart-item-price">Free</div>
              <button
                className="remove-button"
                onClick={() => handleRemoveFromCart(product.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="place-order-button"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            Place Free Order
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCartPage;