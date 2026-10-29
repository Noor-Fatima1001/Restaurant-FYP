import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  fetchProducts,
  updateProductQuantity,
  syncProductsWithCart,
  fetchProductsByEvent,
  updateProductQuantityByAmount,
} from '../redux/productsSlice';
import { addToCart } from '../redux/cartSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import '../styles/ProductsPage.css';
import { hideLoader, showLoader } from '../redux/loaderSlice';

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const eventId = queryParams.get('eventId');
  const dispatch = useAppDispatch();
  const { products ,currencySymbol} = useAppSelector((state) => state.products);
  const cartItems = useAppSelector((state) => state.cart.items);
  const selectedProducts = products.filter((product) => product.quantity > 0);
  useEffect(() => {
    const fetchData=async()=>{
      try{
        dispatch(showLoader());
        if (category) {
          await dispatch(fetchProducts(category)).then(async () => {
            await dispatch(syncProductsWithCart(cartItems));
          });
        } else if (eventId) {
          await dispatch(fetchProductsByEvent(eventId)).then(async () => {
           await  dispatch(syncProductsWithCart(cartItems));
          });
        }
      }catch(err){
        console.log(err);
        dispatch(hideLoader())
      }finally{
          dispatch(hideLoader());
      }
    }
    fetchData();
  }, [category, eventId, cartItems, dispatch]);

  useEffect(() => {
    dispatch(syncProductsWithCart(cartItems));
  }, [cartItems, dispatch]);
  useEffect(()=>{
    dispatch(syncProductsWithCart(cartItems));
  },[])
  const handleQuantityChange = (productId: number, action: 'increment' | 'decrement') => {
    dispatch(updateProductQuantity({ productId, action }));
    addToCart(selectedProducts)
  };

  const updateProductQuantityByAmountChange = (productId, amount) => {
    dispatch(updateProductQuantityByAmount({ productId, amount }));
  };
  const handleInputChange = (productId, value) => {
    const amount = parseInt(value, 10);
      updateProductQuantityByAmountChange(productId, amount);
  };


  const handlePlaceOrder = () => {
    const selectedProducts = products.filter((product) => product.quantity > 0);
    dispatch(addToCart(selectedProducts));
    navigate('/cart');
  };

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-header">Products</div>

        {
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-name">{product.name}</div>
              <div className='catogory-div' >{product.category} </div>
              {product.specialPrice ? (
                <div>
                  <div className="product-price">
                    <del>Price: {currencySymbol} {parseFloat(product.price).toFixed(2)}</del>
                  </div>
                  <div className="special-price">
                    Special Price: {currencySymbol} {parseFloat(product.specialPrice).toFixed(2)}
                  </div>
                  {/* <div className="event-box">
                    {product.event ? (
                      <span>Event: {product.event.name}</span>
                    ) : (
                      <div>No event associated</div>
                    )}
                  </div> */}
                </div>
              ) : (
                <div className="product-price">Price: {currencySymbol} {parseFloat(product.price).toFixed(2)}</div>
              )}
              <div className="product-quantity-controls">
                <button
                  className="product-button"
                  onClick={() => handleQuantityChange(product.id, 'decrement')}
                >
                  -
                </button>
                <input
                  className="product-input"
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleInputChange(product.id, e.target.value)}
                />
                <button
                  className="product-button"
                  onClick={() => handleQuantityChange(product.id, 'increment')}
                >
                  +
                </button>
              </div>
            </div>
          ))
        }

        <button
          className="place-order-button"
          onClick={handlePlaceOrder}
          disabled={selectedProducts.length<=0 && cartItems.length<=0}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
