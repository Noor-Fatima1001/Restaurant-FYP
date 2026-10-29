import { Stripe, StripeElements } from "@stripe/stripe-js";

export interface Product {
  id: number;
  name: string;
  price: string;
  quantity: number;
  active: boolean;
  imageUrl: string[];
  category: string;
  specialPrice: string;
  priceSource: string;
  event: {
    name: string
  };
}

export interface Profile {
  email: string;
  username: string;
  userType: string
}

export interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface SignUpPageProps {
  mode?: 'normal' | 'guest' | 'premium';
}

export interface ResetPasswordErrors {
  otp: string;
  newPassword: string;
  email: string;
  confirmPassword: string;
}

export interface LoginPageErrors {
  name: string;
  email: string;
  password: string;
  general?: string;
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  currencySymbol: string;
}

export interface Order {
  id: string;
  userId: number,
  productId: null | number,
  status: string,
  totalAmount: Float32Array,
  currency_code: string,
  createdAt: string,
  updatedAt: string,
  paymentStatus?:string
}

export interface updateProfileForm  {
  currentPassword?: string;
  newPassword?: string;
  username?: string;
  email?: string;
};


export interface PaymentArgs {
  id: string;
  stripe: Stripe;
  elements: StripeElements;
  showPopup: (message: string) => void;
}

export interface UpdateOrderFucnArgs{
  orderId:string|number;
  products:PlaceOrderProduct[];
}

export interface PlaceOrderProduct{
  productId:number;
  quantity: number;
}

export interface PlaceOrderArgs {
  products: PlaceOrderProduct[];
  showPopup: (message: string) => void;
}

export interface activeOrderProduct{
  productName:string;
}

export interface ProductOrders{
  id:number;
  product: activeOrderProduct;
  quantity: number;
  price: string;
  status?:string
}

export interface activeOrders{
  imageUrls: string[];
  id: number;
  productName: string;
  price: string;
  isActive: boolean;
  category: string;
  eventId: number | null;
  createdAt: string;
  status:string;
  updatedAt: string;
  totalAmount:string;
  paymentStatus:string;
  productOrders:ProductOrders[];
  amountToPay:string;
}

export interface CartState {
  items: Product[];
  currencySymbol: string;
  currentActiveOrders: activeOrders | null;
  activeOrderId:string|null
}


export interface ValidateTokenResponse {
  valid: boolean;
  message?: string;
}

export interface RefreshTokenResponse {
  token: string;
  message?: string;
}


export interface SubscriptionsState{
  subscriptions:Subscription[]
  loading:boolean,
  // id:number,
  currencySymbol:string,
  error:string
}
export interface Subscription{
  id:string,
  selected:boolean,
  active:boolean,
  name:string,
  price:string,
  description:string,
  isUserSubscribed:boolean,
}