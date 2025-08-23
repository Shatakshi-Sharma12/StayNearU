import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaCreditCard, FaCalendarAlt, FaKey } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import { finalizeBooking, resetBooking } from "../Redux/bookingSlice";

function Payment() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const payBtn = useRef(null);
    const { user, token } = useSelector(store => store.auth);
    const {bookingData}=useSelector(store=>store.booking);
    const paymentData = { amount: Math.round(bookingData.amount) };
    const userId=user._id;
    
    const bookData={
        profile:bookingData.profile,
        room:bookingData.room,
        months:bookingData.months,
        amount:bookingData.amount,
        pgId:bookingData.pgId,
        roomId:bookingData.roomId,
        userId:userId
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = true;

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(`${url}/make/payment`, paymentData, config);
            console.log(data);
            

            if (!data || !data.client_secret) {
                toast.error('Failed to retrieve payment intent secret.');
                payBtn.current.disabled = false;
                return;
            }

            const result = await stripe.confirmCardPayment(data.client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                    },
                },
            });

            if (result.error) {
                console.log(result.error);
                
                toast.error(result.error.message);
                payBtn.current.disabled = false;
                return;
            }

            if (result.paymentIntent.status === "succeeded") {
                console.log("payment done");
                        console.log(result.paymentIntent.id);                
                const bookingResponse = await axios.post(`${url}/booking/create`, {...bookData,paymentStatus:"Confirm",transactionId:result.paymentIntent.id}, config);
                if (bookingResponse.data.success) {
                    dispatch(resetBooking());
                    // dispatch(setPaymentInfo({ id: result.paymentIntent.id, status: result.paymentIntent.status }));

                    // if (isCheckOut) {
                    //     dispatch(setCart({
                    //         items: [],
                    //         grandTotal: 0,
                    //         totalQuantity: 0,
                    //     }));
                    //     dispatch(setCheckOut(false));
                    // }

                    toast.success("Payment and Order Successful!");

                    // Send email
                    // const emailResponse = await axios.post(`${url}/auth/mail`, {
                    //     email: user.email,
                    //     userName: user.name,
                    //     type: 'order',
                    //     details: {
                    //         orderId: orderResponse.data.order.id,
                    //         // amount: orderResponse.data.order.amount,
                    //         orderItems: await Promise.all(orderResponse.data.order.orderItems.map(async item => {
                    //             const productResponse = await axios.get(`${url}/products/${item.product}`);
                    //             return {
                    //                 productName: productResponse.data.name,
                    //                 description: productResponse.data.desc,
                    //                 price: productResponse.data.price,
                    //                 quantity: item.quantity
                    //             };
                    //         })),
                    //     }
                    // });

                    // if (emailResponse.data.success) {
                    //     console.log("Order confirmation email sent.");
                    // } else {
                    //     toast.error("Failed to send order confirmation email.");
                    // }

                    navigate('/');
                } else {
                    toast.error("Order creation failed.");
                }
            } else {
                toast.error("Payment failed or requires further action.");
            }
        } catch (error) {
            console.error("Error during payment processing:", error);
            toast.error("An error occurred during payment processing.");
        } finally {
            payBtn.current.disabled = false;
        }
    };

    return (
        <div>
            <div className="max-w-md mx-auto my-40 p-6 bg-gray-100 rounded-lg shadow-md">
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="cardNumber" className="flex items-center mb-2 font-bold text-gray-700">
                            <FaCreditCard className="mr-2 text-gray-600" /> Card Number
                        </label>
                        <CardNumberElement id="cardNumber" className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200" />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="cardExpiry" className="flex items-center mb-2 font-bold text-gray-700">
                            <FaCalendarAlt className="mr-2 text-gray-600" /> Expiry Date
                        </label>
                        <CardExpiryElement id="cardExpiry" className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200" />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="cardCvc" className="flex items-center mb-2 font-bold text-gray-700">
                            <FaKey className="mr-2 text-gray-600" /> CVC
                        </label>
                        <CardCvcElement id="cardCvc" className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200" />
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                        ref={payBtn}
                    >
                        Pay ₹
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Payment;
