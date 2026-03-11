const Vendors=require('../models/vendorModel');

exports.checkSubscription=async(req,res,next)=>{
    try{
        const vendor=await Vendors.findById(req.user.id);

        if(!vendor){
            return res.status(400).json({
                message:"Vendor not found"
            });
        }

        const today=new Date();

        // for trial

        if(vendor.subscriptionStatus==="trial" && today > vendor.trialEndDate){
            vendor.subscriptionStatus="expired";
            await vendor.save();
        }

        // paid subscription

        if(vendor.subscriptionStatus==="active" && today > vendor.subscriptionEndDate){
            vendor.subscriptionStatus="expired";
        }

        if(vendor.subscriptionStatus==="expired"){
            return res.status(403).json({
                message:"Your subscription expired. please renew to continue."
            })
        }

        next();
    }
    catch(err){
        res.status(500).json({
            message:"Error checking subscription",
            error:err.message
        })
    }
}