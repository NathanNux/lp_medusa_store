import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { fetchOrderWithMetadataStep } from "./steps/fetch-order-with-metadata"
import { callPacketaFulfillmentStep } from "./steps/call-packeta-fulfillment"

type PacketaFulfillmentWorkflowInput = {
  orderId: string
  data: Record<string, unknown>
  items: any[]
  fulfillment: any
}

export const packetaFulfillmentWorkflow = createWorkflow<
  PacketaFulfillmentWorkflowInput,
  any,
  any
>(
  "packeta-fulfillment-workflow",
  (input) => {
    console.log("[WORKFLOW] Received input:", input);
    const { orderId, data, items, fulfillment } = input

    // Step 1: Fetch the order with metadata
    const { order, ...rest } = fetchOrderWithMetadataStep({ orderId })
    console.log("[WORKFLOW] Order fetched by fetchOrderWithMetadataStep:", order);

    // Step 2: Call the Packeta fulfillment provider
    const result = callPacketaFulfillmentStep({
      ...rest,
      order,
      data,
      items,
      fulfillment,
    })

    return new WorkflowResponse(result)
  }
)