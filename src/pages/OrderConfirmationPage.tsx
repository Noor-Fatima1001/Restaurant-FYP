import { useState } from 'react';
import '../styles/OrderConfirmationPage.css';

const OrderConfirmationPage = ({ cartItems, totalPrice, history }) => {
  const [loading, setLoading] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);
  const [error, setError] = useState(null);

  const createOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      setOrderResponse(null);
      const response = { success: true, order: { id: '1234', status: 'Completed' } };
      if (response.success) {
        setOrderResponse(response.order);
      } else {
        throw new Error('Failed to create order.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="header">Create Order</h2>

      {loading ? (
        <div className="loading"><img
        src="/images/loader.svg"
        alt="Loading..."
        style={{ width: "50px", height: "50px" }}
      /></div>
      ) : (
        <>
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <span className="item-text">{item.name}</span>
                <span className="item-text">{item.price}</span>
              </div>
            ))}
          </div>

          <div className="summary">
            <p className="total-text">Total Bill: ${totalPrice.toFixed(2)}</p>
          </div>
        </>
      )}

      {error && <p className="error-text">Error: {error}</p>}

      {orderResponse && (
        <div className="response-container">
          <p className="success-text">Order Created Successfully!</p>
          <p className="response-text">Order ID: {orderResponse.id}</p>
          <p className="response-text">Status: {orderResponse.status}</p>
          <button className="back-button" onClick={() => history.push('/home')}>Go to Home</button>
        </div>
      )}

      {!orderResponse && !loading && (
        <button className="order-button" onClick={createOrder}>Create Order</button>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
