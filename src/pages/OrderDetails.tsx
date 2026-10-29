import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import "../styles/OrderDetails.css";
import { getAllActiveOrders } from "../redux/cartSlice";
import { fetchProfile } from "../redux/ProfileSlice";
import { Link } from "react-router-dom";

const OrderDetails = () => {
    const dispatch = useAppDispatch();
    const { currentActiveOrders: order, currencySymbol } = useAppSelector(state => state.cart);
    const { profileData } = useAppSelector(state => state.profile);

    useEffect(() => {
        dispatch(getAllActiveOrders());
        dispatch(fetchProfile());
    }, [dispatch]);


    return (
        <div className="order-details-container">
            <div className="order-details-header">
                <h1>Order Details</h1>
            </div>

            <div className="order-detail-body">
                <div className="order-details-order-info">
                    <div className="sub-item-0">
                        <strong>Order ID: #{order?.id ?? "N/A"}</strong>
                    </div>
                    <div className="sub-item">Customer: {profileData?.username ?? "Guest"}</div>
                    <div className="sub-item">Total Amount: {currencySymbol}{order?.totalAmount ?? "0.00"}</div>
                    <div className="sub-item">Status: {order?.status ?? "N/A"}</div>
                    <div className="sub-item">Amount To Pay: {currencySymbol}{order?.amountToPay ?? "N/A"}</div>
                    <div className="sub-item">
                        Payment Status: {order?.paymentStatus === "COD"
                            ? "Cash On Delivery"
                            : order?.paymentStatus === "pending"
                                ? "Pending"
                                : order?.paymentStatus === "completed"
                                    ? "Completed"
                                    : "Unknown"}
                    </div>
                </div>

                <div className="order-details-order-items">
                    <div className="item-header" >
                    <h2>Ordered Items</h2>  <Link to={"/welcome"} className="item-header-icon" >+</Link>
                    </div>
                    <div className="order-details-head">
                        <div>Category</div>
                        <div>Price</div>
                        <div>Subtotal</div>
                        <div>Status</div>
                        <div>Quantity</div>
                    </div>

                    <div className="order-details-body">
                        {order?.productOrders?.map(item => (
                            <div key={item.id} className="order-items">
                                <div>{item.product?.productName ?? "Unknown"}</div>
                                <div>{currencySymbol}{item.price}</div>
                                <div>{currencySymbol}{(Number(item.price) * item.quantity).toFixed(2)}</div>
                                <div>{item.status}</div>
                                <div className="order-items-quantity" >{item.quantity}</div>
                            </div>
                        ))}
                    </div>

                    <div className="order-details-footer">
                        <div className="order-items-footer">
                            Total Amount: {currencySymbol}{order?.totalAmount ?? "0.00"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
