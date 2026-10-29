import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { useEffect } from 'react';
import { getAllActiveOrders } from '../redux/cartSlice';
import "../styles/CartPage.css";
import { hideLoader, showLoader } from '../redux/loaderSlice';
import { useNavigate } from 'react-router-dom';
const ActiveOrderBox = () => {
    const currentActiveOrders = useAppSelector(state => state.cart.currentActiveOrders);
    const currencySymbol = useAppSelector((state) => state.cart.currencySymbol);
    const dispatch = useAppDispatch();
    const navigate=useNavigate();
    useEffect(() => {
        const fetcActiveOrder=async()=>{
            try{
                dispatch(showLoader())
                await dispatch(getAllActiveOrders());
            }catch(err){
                dispatch(hideLoader());
                console.error(err)
            }finally{
                dispatch(hideLoader());
            }
        }
        fetcActiveOrder();
    },[])

    const handleShowOrder = () => {
        navigate("/order-details");
    }

    return (
        <div className='active-order-box' >
            {
                currentActiveOrders ?
                <div  >
                        <div className='active-order-title' >Active Orders</div>
                        <div className="cart-cartItem">
                            <div className="cart-itemDetails">
                                <div onClick={() => handleShowOrder()} >
                                    <div className="active-order-box-title" >Order #{currentActiveOrders.id}</div>
                                    <div className='active-order-box-status' >
                                    Status: {
                                        currentActiveOrders.status
                                    }
                                    </div>
                                </div>
                            </div>
                            <div className="active-order-box-price">
                                {currencySymbol} {currentActiveOrders.totalAmount}
                            </div>
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default ActiveOrderBox;