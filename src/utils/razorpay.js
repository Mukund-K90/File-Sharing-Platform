const Razorpay = require('razorpay');
const { CONFIG } = require('../config/config');

const razorpayInstance = new Razorpay({
    key_id: CONFIG.razorPayKeyId,
    key_secret: CONFIG.razorPayKeySecret,
});

const createCustomer = async (email, name, contact) => {
    try {
        const customer = await razorpayInstance.customers.create({
            name,
            email,
            contact
        });
        return customer.id;
    } catch (error) {
        console.error("Error creating customer:", error);
        throw new Error("Failed to create customer");
    }
};

const checkCustomer = async (customerId) => {
    try {
        const customer = await razorpayInstance.customers.fetch(customerId);
        return customer;
    } catch (error) {
        if (error.statusCode === 400 && error.error.code === 'BAD_REQUEST_ERROR') {
            console.warn("Customer not found:", error.error.description);
            return null;
        }
        console.error("Error fetching customer:", error);
        throw new Error("Failed to fetch customer");
    }
};

const createSubscription = async (planId, customerId) => {
    try {
        const subscription = await razorpayInstance.subscriptions.create({
            plan_id: planId,
            total_count: 1,
            customer_notify: 1,
            customer_id: customerId,
        });

        return subscription;
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw new Error("Failed to create subscription");
    }
};

const generateSubscriptionDetails = async (subscriptionId) => {
    try {
        const subscription = await razorpayInstance.subscriptions.fetch(subscriptionId);
        return subscription;
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw new Error("Failed to create subscription");
    }
}

module.exports = {
    createSubscription,
    createCustomer,
    checkCustomer
};
