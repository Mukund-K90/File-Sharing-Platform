const Razorpay = require('razorpay');
const { CONFIG } = require('../config/config');

const razorpayInstance = new Razorpay({

    key_id: CONFIG.razorPayKeyId,

    key_secret: CONFIG.razorPayKeySecret
});

const createCustomer = async (email, name) => {
    try {
        const customer = await razorpayInstance.customers.create({
            name,
            email,
        });
        return customer.id;
    } catch (error) {
        console.error("Error creating customer:", error);
        throw new Error("Failed to create customer");
    }
};

const createSubscription = async (planId, email, name) => {
    try {
        const customerId = await createCustomer(email, name);
        const subscription = razorpayInstance.subscriptions.create({
            plan_id: planId,
            total_count: 12,
            customer_notify: 1,
            customer: {
                customerId,
                name,
                email,
                contact: "",
            },
        });
        return subscription;
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw new Error("Failed to create subscription");
    }
};


const generateSubscriptionLink = (subscriptionId) => {
    return `https://checkout.razorpay.com/v1/checkout.js?subscription_id=${subscriptionId}`;
};

module.exports = {
    createSubscription,
    createCustomer,
    generateSubscriptionLink,
};
