import { createOrderFulfillmentWorkflow } from "@medusajs/medusa/core-flows"
import { packetaFulfillmentWorkflow } from "../custom-packeta-fulfillment-workflow"

createOrderFulfillmentWorkflow.hooks.fulfillmentCreated(
  async ({ fulfillment, additional_data }, { container }) => {
    const orderId = typeof additional_data?.order_id === "string" ? additional_data.order_id : undefined;
    console.log("[HOOK] orderId from additional_data:", orderId);
    if (!orderId) {
      throw new Error("Order ID is missing in additional_data");
    }
    await packetaFulfillmentWorkflow(container).run({
      input: {
        orderId,
        data: {},
        items: fulfillment.items,
        fulfillment,
      },
    })
  }
)