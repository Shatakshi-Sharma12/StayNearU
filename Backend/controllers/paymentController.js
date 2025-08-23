import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const makePayment=async (req, res) => {
    const {amount}=req.body;
    if (isNaN(amount) || amount <= 0) {
        return res.json({ msg: 'Invalid total price' });
    }
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'inr',
            metadata: { company: "StayNearU" },
        });
        return res.json({ 
            success: true, 
            client_secret: paymentIntent.client_secret,
            msg: "Payment Successful"
        });
    } catch (error) {
        console.error('Error creating order or payment intent:', error);
        return res.json({ msg: 'Failed to create order or payment intent' });
    }
};

const sendStripeKey=async(req,res)=>{
    res.json({stripeApiKey:process.env.STRIPE_API_KEY})
}

export {makePayment,sendStripeKey}