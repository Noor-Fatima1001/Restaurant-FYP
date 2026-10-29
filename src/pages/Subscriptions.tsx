import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    fetchSubscriptions,
    fetchSubscriptionById,
    createPaymentIntent,
    completePurchase,
    toggleSubscriptionSelection,
} from '../redux/subscriptionsSlice';
import { hideLoader, showLoader } from '../redux/loaderSlice';
import { usePopup } from '../components/CustomPopup/PopupContext';
import {
    loadStripe,
    StripeElementsOptions,
} from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import '../styles/SubscriptionsPage.css';
import { Subscription } from '../types/interface';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentFormProps {
    subscriptionId: string;
    clientSecret: string;
    subscription: Subscription;
    currencySymbol: string;
    onSuccess: (paymentIntentId: string) => void;
    onError: (message: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    clientSecret,
    subscription,
    currencySymbol,
    onSuccess,
    onError
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [billingName, setBillingName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {

        event.preventDefault();
        setErrorMessage('');

        if (!stripe || !elements) {
            onError('Stripe has not loaded yet.');
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            onError('Card element not found.');
            return;
        }

        if (!billingName.trim()) {
            setErrorMessage('Please enter your full name.');
            return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: billingName,
                },
            },
        });

        if (error) {
            const errorMsg = error.message || 'Payment failed.';
            setErrorMessage(errorMsg);
            onError(errorMsg);
        } else {
            console.log('Payment intent status:', paymentIntent?.status);
            if (paymentIntent?.status === 'succeeded') {
                onSuccess(paymentIntent.id);
            } else {
                const msg = `Payment not completed. Status: ${paymentIntent?.status || 'unknown'}`;
                setErrorMessage(msg);
                onError(msg);
            }
        }
    };

    return (
        <div className="payment-form-container" style={{ maxWidth: '400px', padding: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>Subscribe to {subscription.name}</h3>
            <p style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                Amount: {currencySymbol}{parseFloat(subscription.price).toFixed(2)}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="billing-name" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                        Full Name
                    </label>
                    <input
                        id="billing-name"
                        type="text"
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px',
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="card-element" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                        Card Details
                    </label>
                    <div
                        id="card-element"
                        style={{
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                        }}
                    >
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {errorMessage && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '-5px' }}>
                        {errorMessage}
                    </div>
                )}

                <button
                    type="submit"
                    onClick={(e) => { handleSubmit(e) }}
                    disabled={!stripe || !elements || !billingName.trim()}
                    style={{
                        padding: '12px',
                        backgroundColor: '#635bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        opacity: (!stripe || !elements || !billingName.trim()) ? 0.5 : 1,
                    }}
                >
                    Pay {currencySymbol}{parseFloat(subscription.price).toFixed(2)}
                </button>
            </form>
        </div>
    );
};

const SubscriptionsPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { showPopup } = usePopup();

    const { subscriptions, selectedSubscription, loading, error, currencySymbol } = useAppSelector(
        (state) => state.subscriptions
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(showLoader());
                await dispatch(fetchSubscriptions()).unwrap();
            } catch (err) {
                console.log(err);
                showPopup('Error fetching subscriptions. Please try again.');
            } finally {
                dispatch(hideLoader());
            }
        };
        fetchData();
    }, [dispatch, showPopup]);

    const handleSubscribe = async (subscriptionId: string, sub: Subscription) => {
        if (sub.selected) {
            dispatch(toggleSubscriptionSelection(subscriptionId));
            showPopup('Subscription cancelled.');
            return;
        }

        try {
            dispatch(showLoader());
            const fetchedClientSecret = await dispatch(createPaymentIntent(subscriptionId)).unwrap();

            const options: StripeElementsOptions = { clientSecret: fetchedClientSecret };

            const PaymentPopupContent = () => {
                const localDispatch = useAppDispatch();

                const handlePaymentSuccess = async (paymentIntentId: string) => {
                    try {
                        console.log('Calling completePurchase with paymentIntentId:', paymentIntentId);

                        await localDispatch(completePurchase({ subscriptionId, paymentIntentId })).unwrap();
                        showPopup('Payment successful! Subscription activated.');
                    } catch (err) {
                        console.error('Error in completePurchase:', err);
                        showPopup('Error completing purchase. Please try again.');
                    }
                };

                const handlePaymentError = (message: string) => {
                    console.log('Payment error:', message);
                    showPopup(message);
                };

                return (
                    <Elements stripe={stripePromise} options={options}>
                        <PaymentForm
                            subscriptionId={subscriptionId}
                            clientSecret={fetchedClientSecret}
                            subscription={sub}
                            currencySymbol={currencySymbol}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                        />
                    </Elements>
                );
            };

            showPopup(<PaymentPopupContent />);
        } catch (err) {
            console.log('Error in handleSubscribe:', err);
            showPopup(err ? err : 'Error creating payment intent. Please try again.');
        } finally {
            dispatch(hideLoader());
        }
    };

    const handleDetails = async (subscriptionId: string) => {
        try {
            dispatch(showLoader());
            await dispatch(fetchSubscriptionById(subscriptionId)).unwrap();

            const subscriptionDetails = (
                <div>
                    {selectedSubscription ? (
                        <>
                            <h3>{selectedSubscription.name}</h3>
                            <p>Price: {currencySymbol}{parseFloat(selectedSubscription.price).toFixed(2)}</p>
                            <p>Description: {selectedSubscription.description}</p>
                            <p>Status: {selectedSubscription.active ? 'Active' : 'Inactive'}</p>
                        </>
                    ) : (
                        <p>No details available</p>
                    )}
                </div>
            );
            showPopup(subscriptionDetails);
        } catch (err) {
            console.log(err);
            showPopup('Error fetching subscription details. Please try again.');
        } finally {
            dispatch(hideLoader());
        }
    };

    const handleOrder=(subscription:Subscription)=>{
        const sub=JSON.stringify(subscription)
        sessionStorage.setItem("selectedSubscription",sub);
        navigate("/free-products");
    }

    return (
        <div className="subscription-page">
            <div className="subscription-header">Subscriptions</div>
            {loading && <div>Loading...</div>}
            {error && <div className="error-message">{error}</div>}
            <div className="subscription-container">
                {subscriptions.map((sub: Subscription) => (
                    <div key={sub.id} className="subscription-card">
                        <div>{sub?.isUserSubscribed ? "Active" : ""}</div>
                        <div className="subscription-name">{sub.name}</div>
                        <div className="subscription-price">
                            {currencySymbol} {parseFloat(sub?.price)?.toFixed(2)}
                        </div>
                        <div className="subscription-description">{sub.description}</div>
                        {sub.active && <div className="active-badge">Active</div>}
                        <div className="subscription-controls">
                            {sub?.isUserSubscribed ?

                                <button
                                    className="subscribe-button"
                                    onClick={() => handleOrder(sub)}
                                >
                                    Order Now
                                </button>
                                :
                                <button
                                    className="subscribe-button"
                                    onClick={() => handleSubscribe(sub.id, sub)}
                                >
                                    Buy Now
                                </button>
                            }
                            <button
                                className="details-button"
                                onClick={() => handleDetails(sub.id)}
                            >
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionsPage;