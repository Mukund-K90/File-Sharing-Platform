const { createSubscription, generateSubscriptionLink, checkCustomer, createCustomer, } = require("../../../utils/razorpay");
const Subscription = require('../../../model/subscription');
exports.buySubscription = async (req, res) => {

    try {
        const { planId } = req.params.planId;
        const user = req.user;
        let customerId = "";
        const subscriptionDetails = await Subscription.findOne({ userId: user._id }).where({ createdAt: -1 });
        if (!subscriptionDetails) {
            const newCustomer = await createCustomer(user.email, user.name, user.mobile);
            customerId = newCustomer.id;
        }
        customerId = subscriptionDetails.customerId;


        // Create a subscription
        const subscription = await createSubscription(planId, customerId);

        if (subscription) {
            const addsubscriptionData = await Subscription({ planId, customerId, userId: user._id });
            addsubscriptionData.save();
        }
        res.status(200).json({
            success: true,
            message: "Subscription created successfully",
            subscriptionId: subscription.id,
            paymentLink: subscription.short_url,
        });
    } catch (error) {
        console.error("Subscription error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

