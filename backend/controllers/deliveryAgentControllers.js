const DeliveryAgent=require('../models/deliveryAgentModel');
const Orders=require('../models/ordersModel');

exports.getAssignedOrders=async(req,res)=>{
    try{
        const agentId=req.user.id;
        const orders=await Orders.find({
            deliveryAgentId:agentId
        }).populate("userId", "name mobile address")
            .populate("items.productId","name image price")
            .populate("items.vendorId","shopName mobile address")


        res.status(200).json({
            status:"success",
            message:"fetched assigned orders",
            orders
        })
    }
    catch(err){
        res.status(500).json({
            message:"error while fecthing assigned orders",
            err:err.message
        })
    }
}


// update delivery status

exports.updateDeliveryStatus=async(req,res)=>{
    try{
        const {orderId,status}=req.body;

        const order=await Orders.findById(orderId)

        order.deliveryStatus=status;
        if(status==="Delivered"){
            order.orderStatus="Delivered"
        }

        await order.save();

        res.status(200).json({
            status:"success",
            message:"status upadted"
        });
    }
    catch(err){
        res.status(500).json({
            message:"error while updating order delivery status",
            err:err.message
        })
    }
}

// update payment status

exports.updatePaymentStatus=async(req,res)=>{
    try{
        const {orderId}=req.body;

        const order=await Orders.findById(orderId);

        if(!order){
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.paymentMethod !== "COD") {
            return res.status(400).json({
                message: "Payment already handled online"
            });
        }

        order.paymentStatus = "Completed";

        await order.save();

        res.status(200).json({
            status: "success",
            message: "Payment marked as completed"
        });
    }
    catch(err){
        res.status(500).json({
            message: "Error updating payment status",
            err: err.message
        });
    }
}