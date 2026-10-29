// FreeProductsPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchFreeProducts, addToCart } from '../redux/subscriptionsSlice';
import { hideLoader, showLoader } from '../redux/loaderSlice';
import { usePopup } from '../components/CustomPopup/PopupContext';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/interface';

interface AvailableProduct {
  product: {
    imageUrls: string[];
    id: number;
    productName: string;
    price: string;
  };
  maxQuantity: number;
  totalRemaining: number;
  dailyRemaining: number;
}

const FreeProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showPopup } = usePopup();

  const { subscriptions, cart, freeProducts, loading, error } = useAppSelector(
    (state) => state.subscriptions
  );

  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: number]: number }>({});

  const selectedSubscription = useMemo(() => 
    JSON.parse(sessionStorage.getItem("selectedSubscription") || '{}'), 
  []);
  const userSub = selectedSubscription?.subscriptionUserDetail;
  const subscriptionId = selectedSubscription?.id;
  const userSubscriptionId = userSub?.userSubscriptionId;
  const tableId = 5; // TODO: Retrieve dynamic table ID from context or state

  useEffect(() => {
    if (userSubscriptionId) {
      const fetchData = async () => {
        try {
          dispatch(showLoader());
          await dispatch(fetchFreeProducts(userSubscriptionId)).unwrap();
        } catch (err) {
          console.log(err);
          showPopup('Error fetching free products. Please try again.');
        } finally {
          dispatch(hideLoader());
        }
      };
      fetchData();
    } else {
      showPopup('No active subscription found.');
      navigate('/subscriptions');
    }
  }, [dispatch, navigate, showPopup, userSubscriptionId]);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  const totalCartItems = useMemo(() => 
    cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0), [cart]
  );

  const handleAddToCart = async (product: { id: number; productName: string }, quantity: number) => {
    if (quantity > 0 && subscriptionId && userSubscriptionId) {
      const payload = {
        subscriptionId,
        tableId,
        products: [{ productId: product.id, quantity }]
      };
      try {
        await dispatch(addToCart(payload)).unwrap();
        showPopup(`${quantity} x ${product.productName} added to cart!`);
        setSelectedQuantities(prev => ({ ...prev, [product.id]: 0 }));
        // Refetch to update remaining quantities
        await dispatch(fetchFreeProducts(userSubscriptionId)).unwrap();
      } catch (err) {
        console.log(err);
        showPopup('Error adding to cart. Please try again.');
      }
    }
  };

  const totalSelectedQty = useMemo(() => 
    freeProducts.reduce((sum: number, item: AvailableProduct) => 
      sum + (selectedQuantities[item.product.id] || 0), 0
    ), [freeProducts, selectedQuantities]
  );

  return (
    <div className="free-products-page">
      <div className="free-products-header">Free Products</div>
      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="free-products-container">
        {freeProducts.map((item: AvailableProduct) => {
          const product = item.product;
          const qty = selectedQuantities[product.id] || 0;
          const maxQty = item.dailyRemaining;
          return (
            <div key={product.id} className="product-card">
              <div className="product-name">{product.productName}</div>
              <div className="product-price">${product.price}</div>
              <div className="product-daily-remaining">Daily Remaining: {item.dailyRemaining}</div>
              <div className="product-total-remaining">Total Remaining: {item.totalRemaining}</div>
              <div className="quantity-selector">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedQuantities((prev) => ({
                      ...prev,
                      [product.id]: Math.max(0, (prev[product.id] || 0) - 1),
                    }))
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max={maxQty}
                  value={qty}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setSelectedQuantities((prev) => ({
                      ...prev,
                      [product.id]: Math.min(maxQty, Math.max(0, val)),
                    }));
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setSelectedQuantities((prev) => ({
                      ...prev,
                      [product.id]: Math.min(maxQty, (prev[product.id] || 0) + 1),
                    }))
                  }
                >
                  +
                </button>
              </div>
              <button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(product, qty)}
                disabled={qty === 0}
              >
                Add
              </button>
            </div>
          );
        })}
      </div>
      <div className="total-section">Total Items Selected: {totalSelectedQty}</div>
      <button className="view-cart-button" onClick={() => navigate('/cart')}>
        View Cart ({totalCartItems})
      </button>
    </div>
  );
};

export default FreeProductsPage;