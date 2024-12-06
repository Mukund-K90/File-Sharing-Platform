const Plan = require("../model/plan");

const plans = [
    {
        name: "Free",
        description: "Free forever",
        price: 0,
        duration: "monthly",
        planId:"free",
        features: [
            { feature: "Management", limit: { users: 3 } },
            { feature: "Product Environments", limit: { count: 1 } },
            { feature: "Monthly Credits", limit: { count: 25 } },
            { feature: "Admin API Limit", limit: { requests: 500 } },
            { feature: "Media", limit: { maxImageSize: "10 MB", maxVideoSize: "100 MB", maxRawFileSize: "10 MB" } },
            { feature: "Image Transformation", limit: { maxImageSize: "100 MB", maxMegapixels: "25 MP" } },
            { feature: "Video Transformation", limit: { maxVideoSize: "40 MB", maxMegapixelsInFrames: "50 MP" } },
        ],
    },
    {
        name: "Plus",
        description: "Extend your team’s digital media capabilities for websites & apps.",
        price: 99,
        duration: "monthly",
        planId:"lan_PTlmcqzJn9toAM",
        features: [
            { feature: "Management", limit: { users: 3 } },
            { feature: "Product Environments", limit: { count: 2 } },
            { feature: "Monthly Credits", limit: { count: 225 } },
            { feature: "Admin API Limit", limit: { requests: 2000 } },
            { feature: "Media", limit: { maxImageSize: "20 MB", maxVideoSize: "2 GB", maxRawFileSize: "20 MB" } },
            { feature: "Image Transformation", limit: { maxImageSize: "100 MB", maxMegapixels: "25 MP" } },
            { feature: "Video Transformation", limit: { maxVideoSize: "300 MB", maxMegapixelsInFrames: "100 MP" } },
        ],
    },
    {
        name: "Advanced",
        description: "Create engaging visual experiences with advanced features.",
        price: 249,
        duration: "monthly",
        planId:"plan_PTmCPSXJWIXLfj",
        features: [
            { feature: "Management", limit: { users: 5 } },
            { feature: "Product Environments", limit: { count: 3 } },
            { feature: "Monthly Credits", limit: { count: 600 } },
            { feature: "Admin API Limit", limit: { requests: 2000 } },
            { feature: "Media", limit: { maxImageSize: "40 MB", maxVideoSize: "4 GB", maxRawFileSize: "40 MB" } },
            { feature: "Image Transformation", limit: { maxImageSize: "100 MB", maxMegapixels: "50 MP" } },
            { feature: "Video Transformation", limit: { maxVideoSize: "300 MB", maxMegapixelsInFrames: "200 MP" } },
        ],
    },
];


async function addPlans() {
    const existingPlans = await Plan.find();
    if (!existingPlans || existingPlans.length === 0 || existingPlans.length < 3) {
        return Plan.insertMany(plans);
    }
}

async function initializePlans() {
    try {
        await addPlans();
        console.log("Plans have been initialized.");
    } catch (error) {
        console.error("Error initializing plans:", error);
    }
}

module.exports = { initializePlans };
