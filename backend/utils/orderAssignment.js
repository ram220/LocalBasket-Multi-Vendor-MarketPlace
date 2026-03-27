const DeliveryAgent=require('../models/deliveryAgentModel');
const Orders=require('../models/ordersModel')
const autoAssignAgent = async (orderId) => {
    try {
        console.log("auto assignment called for ",orderId)
        const agents = await DeliveryAgent.find({
                status: "approved",
                isAvailable: true,
        });

        // filter based on each agent capacity
        const filteredAgents = agents.filter(
            agent => agent.activeOrders < agent.maxOrdersLimit
        );

        console.log("Agents found:", agents.length);
console.log("Filtered agents:", filteredAgents.length);

        if (filteredAgents.length === 0) {
            await Orders.findByIdAndUpdate(orderId, {
                deliveryStatus: "Pending"
            });
            return;
        }

        // sort by least workload
        filteredAgents.sort((a, b) => a.activeOrders - b.activeOrders);

        const selectedAgent = filteredAgents[0];
        console.log("selected agent: ",selectedAgent)

        // assign order
        await Orders.findByIdAndUpdate(orderId, {
            deliveryAgentId: selectedAgent._id,
            deliveryStatus: "Assigned"
        });

        // update agent workload
        selectedAgent.activeOrders += 1;
        selectedAgent.currentOrder=orderId

        if (selectedAgent.activeOrders >= selectedAgent.maxOrdersLimit) {
            selectedAgent.isBusy = true;
        }else{
            selectedAgent.isBusy=false;
        }

        await selectedAgent.save();

    } catch (err) {
        console.log("Auto assign error:", err);
    }
};

module.exports=autoAssignAgent