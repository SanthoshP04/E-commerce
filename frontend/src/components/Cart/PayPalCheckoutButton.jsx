import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalCheckoutButton = ({ amount, onSuccess, onError }) => {
    return (
        <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "USD" }}>
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: "USD",
                                    value: (amount).toFixed(2) // Convert from paisa to USD
                                }
                            }
                        ]
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        onSuccess(details);
                    });
                }}
                onError={(err) => {
                    console.error("PayPal Checkout Error:", err);
                    onError(err);
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalCheckoutButton;
