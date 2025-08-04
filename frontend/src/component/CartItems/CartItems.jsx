import React, { useContext, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const API = import.meta.env.VITE_API_BASE_URL; // Use environment variable for API base URL

const CartItems = () => {
  const {
    all_product,
    cartItems,
    removeFromCart,
    getTotalCartValue,
    addToCart,
    clearCart,
  } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(""); // Add payment method state
  const [transactionId, setTransactionId] = useState("");
  const [txnSubmitted, setTxnSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();
  const PAYMENT_OPTIONS = [
    {
      id: "bkash",
      name: "bKash",
      number: "01737856391",
    },
    {
      id: "nagad",
      name: "Nagad",
      number: "01737856391", // Or different number if needed
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      number: null,
    },
  ];

  const cartValue = getTotalCartValue();
  const shippingFee = cartValue === 0 || cartValue > 800 ? 0 : 100;
  const totalAmount = cartValue + shippingFee;

  // Submit transaction ID to backend
  const submitTxnId = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) return navigate("/login");

      const response = await fetch(`${API}/order/submit-transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          orderId,
          transactionId,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to submit transaction ID");

      setTxnSubmitted(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle checkout process
  const handleCheckout = async () => {
    const cartItemList = Array.isArray(cartItems)
      ? cartItems
      : Object.values(cartItems);

    if (cartItemList.length === 0) {
      setError("Your cart is empty");
      return;
    }
    if (!shippingAddress.trim()) {
      setError("Please enter a shipping address");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        navigate("/login");
        return;
      }

      const orderItems = cartItemList.map((item) => {
        const product = all_product.find((p) => p.id === item.itemId);
        return {
          productId: item.itemId,
          name: product?.name || "Unknown Product",
          size: item.size,
          quantity: item.quantity,
          price: product?.new_price || 0,
          image: product?.image || "",
        };
      });

      const response = await fetch(`${API}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          items: orderItems,
          subtotal: cartValue,
          shipping: shippingFee,
          total: totalAmount,
          shippingAddress,
          phoneNumber,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Checkout failed");
      }

      const data = await response.json();
      setShowConfirmation(true);
      setOrderId(data.orderId);
      clearCart();
      setTransactionId("");
      setTxnSubmitted(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Size</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          {showConfirmation ? (
            <div className="order-success-message">
              <FaCheckCircle className="success-icon" />
              <h3>Your order has been placed successfully!</h3>
              <button
                onClick={() =>
                  navigate("/order-confirmation", { state: { orderId } })
                }
                className="view-confirmation-btn"
              >
                View Order Details
              </button>
            </div>
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
      ) : (
        cartItems.map((item) => {
          const product = all_product.find((e) => e.id === item.itemId);
          if (product) {
            return (
              <div key={`${item.itemId}-${item.size}`}>
                <div className="cartitems-format cartitems-format-main">
                  <img
                    className="carticon-product-icon"
                    src={product.image}
                    alt={product.name}
                  />
                  <p>{product.name}</p>
                  <p>{item.size}</p>
                  <p>৳{product.new_price}</p>
                  <div className="cartitems-quantity">
                    <button
                      onClick={() => removeFromCart(item.itemId, item.size)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item.itemId, item.size)}>
                      +
                    </button>
                  </div>
                  <p>৳{product.new_price * item.quantity}</p>
                  <img
                    className="cartitems-remove-icon"
                    onClick={() => removeFromCart(item.itemId, item.size, true)}
                    src={remove_icon}
                    alt="Remove"
                  />
                </div>
              </div>
            );
          }
          return null;
        })
      )}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>৳{cartValue}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>{shippingFee === 0 ? "Free" : `$${shippingFee}`}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>৳{totalAmount}</h3>
            </div>
          </div>

          {!showConfirmation && (
            <>
              <div className="checkout-fields">
                {/* Shipping Address */}
                <div className="form-group">
                  <label>Shipping Address *</label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows="3"
                    required
                    placeholder="Enter your full shipping address"
                  />
                </div>

                {/* Phone Number */}
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="123-456-7890"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div className="form-group">
                  <label>Select Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="">Select a payment method</option>
                    {PAYMENT_OPTIONS.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name} {method.number && `(${method.number})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
                className={loading ? "checkout-loading" : ""}
              >
                {loading ? "Processing..." : "PROCEED TO CHECKOUT"}
              </button>
            </>
          )}

          {showConfirmation && (
            <div className="confirmation-section">
              <FaCheckCircle className="success-icon" />
              <h3>Order Placed Successfully!</h3>
              <p>Your order ID: #{orderId}</p>

              {/* Payment Instructions & Transaction ID submission */}
              {paymentMethod === "bkash" && (
                <div className="payment-instructions">
                  <p>
                    Please send <strong>৳{totalAmount}</strong> to{" "}
                    <strong>
                      {PAYMENT_OPTIONS.find((m) => m.id === "bkash").number}{" "}
                      (bKash Personal)
                    </strong>{" "}
                    using:
                  </p>
                  <div className="payment-steps">
                    <p>1. Go to your bKash Mobile Menu</p>
                    <p>2. Select "Send Money"</p>
                    <p>
                      3. Enter the bKash Number:{" "}
                      <strong>
                        {PAYMENT_OPTIONS.find((m) => m.id === "bkash").number}
                      </strong>
                    </p>
                    <p>
                      4. Enter Amount: <strong>৳{totalAmount}</strong>
                    </p>
                    <p>
                      5. Enter Reference: <strong>Order #{orderId}</strong>
                    </p>
                    <p>6. Enter your bKash PIN to confirm</p>
                  </div>

                  {!txnSubmitted ? (
                    <div className="txn-field">
                      <h4>Enter Your bKash Transaction ID:</h4>
                      <div className="txn-input-group">
                        <input
                          type="text"
                          placeholder="Ex: 8A2BC4DEF5"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                        />
                        <button
                          onClick={submitTxnId}
                          disabled={!transactionId.trim()}
                          className="submit-txn-btn"
                        >
                          Submit Transaction ID
                        </button>
                      </div>
                      <p className="txn-note">
                        You can find the Transaction ID in your bKash payment
                        confirmation SMS.
                      </p>
                    </div>
                  ) : (
                    <div className="txn-confirmation">
                      <FaCheckCircle className="success-icon" />
                      <p>Transaction ID submitted successfully!</p>
                      <p>
                        We'll verify your payment and update your order status
                        shortly.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === "nagad" && (
                <div className="payment-instructions">
                  <p>
                    Please send <strong>৳{totalAmount}</strong> to{" "}
                    <strong>
                      {PAYMENT_OPTIONS.find((m) => m.id === "nagad").number}{" "}
                      (Nagad Personal)
                    </strong>{" "}
                    using:
                  </p>
                  <div className="payment-steps">
                    <p>1. Go to your Nagad Mobile Menu</p>
                    <p>2. Select "Send Money"</p>
                    <p>
                      3. Enter the Nagad Number:{" "}
                      <strong>
                        {PAYMENT_OPTIONS.find((m) => m.id === "nagad").number}
                      </strong>
                    </p>
                    <p>
                      4. Enter Amount: <strong>৳{totalAmount}</strong>
                    </p>
                    <p>
                      5. Enter Reference: <strong>Order #{orderId}</strong>
                    </p>
                    <p>6. Enter your Nagad PIN to confirm</p>
                  </div>

                  {!txnSubmitted ? (
                    <div className="txn-field">
                      <h4>Enter Your Nagad Transaction ID:</h4>
                      <div className="txn-input-group">
                        <input
                          type="text"
                          placeholder="Ex: NGD123456789"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                        />
                        <button
                          onClick={submitTxnId}
                          disabled={!transactionId.trim()}
                          className="submit-txn-btn"
                        >
                          Submit Transaction ID
                        </button>
                      </div>
                      <p className="txn-note">
                        You can find the Transaction ID in your Nagad payment
                        confirmation SMS.
                      </p>
                    </div>
                  ) : (
                    <div className="txn-confirmation">
                      <FaCheckCircle className="success-icon" />
                      <p>Transaction ID submitted successfully!</p>
                      <p>
                        We'll verify your payment and update your order status
                        shortly.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="cod-instructions">
                  <h4>Cash on Delivery Selected</h4>
                  <p>
                    Please keep <strong>৳{totalAmount}</strong> ready for when
                    our delivery agent arrives.
                  </p>
                  <p>
                    Our delivery team will contact you at{" "}
                    <strong>{phoneNumber}</strong> before delivery.
                  </p>
                  <div className="cod-notes">
                    <p>✓ Please check your items before making payment</p>
                    <p>✓ We accept exact cash only</p>
                    <p>✓ Delivery time: 1-3 business days</p>
                  </div>
                </div>
              )}

              <div className="confirmation-actions">
                <button
                  onClick={() =>
                    navigate("/order-confirmation", { state: { orderId } })
                  }
                  className="view-confirmation-btn"
                >
                  View Full Order Details
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="continue-shopping-btn"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

          {/* Show My Orders button if logged in */}
          {localStorage.getItem("auth-token") && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button
                onClick={() => navigate("/my-orders")}
                className="btn-myorders"
              >
                View My Orders
              </button>
            </div>
          )}

          {error && <div className="checkout-error">{error}</div>}
        </div>

        <div className="cartitems-promocode">
          <p>If you have a promo code, enter it here.</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="Promo Code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
