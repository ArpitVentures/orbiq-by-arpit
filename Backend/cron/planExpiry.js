const cron = require("node-cron");
const User = require("../models/User");

cron.schedule("* * * * *", async () => {

    try{

        const now = new Date();

        const result = await User.updateMany(
            {
                planStatus: "Active",
                planExpiry: {$lte: now}
            },
            {
                $set: {
                    planStatus: "Expired"
                }
            }
        );

        if(result.modifiedCount > 0) {

            console.log(
                `${result.modifiedCount} plan(s) expired`
            );
        }
    } catch (error) {
        console.log(error.message);
    }
});

console.log("Plan Expiry Cron Started");