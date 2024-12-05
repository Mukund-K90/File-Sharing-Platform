const { createSubscription, createCustomer, generateSubscriptionLink } = require("../../../utils/razorpay");

exports.buySubscription = async (req, res) => {
    const { email, name, planId } = req.body;

    try {
        // Create a subscription
        const subscription = await createSubscription(planId, email, name);

        // Generate payment link
        const paymentLink = generateSubscriptionLink(subscription.id);

        res.status(200).json({
            success: true,
            message: "Subscription created successfully",
            subscriptionId: subscription.id,
            paymentLink,
        });
    } catch (error) {
        console.error("Subscription error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

