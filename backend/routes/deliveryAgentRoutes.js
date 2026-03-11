const express=require('express');
const authMiddleware=require('../middlewares/authMiddlewares');
const deliveryAgentControllers=require('../controllers/deliveryAgentControllers');

const router=express.Router();
router.get('/getAgentOrders',authMiddleware.protectRoutes,authMiddleware.isDeliveryAgent,deliveryAgentControllers.getAssignedOrders);
router.patch("/updateDeliveryStatus",authMiddleware.protectRoutes,authMiddleware.isDeliveryAgent,deliveryAgentControllers.updateDeliveryStatus);
router.patch("/updatePaymentStatus",authMiddleware.protectRoutes,authMiddleware.isDeliveryAgent,deliveryAgentControllers.updatePaymentStatus);

module.exports=router;