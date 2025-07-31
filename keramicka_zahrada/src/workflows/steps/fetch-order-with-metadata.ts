import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const fetchOrderWithMetadataStep = createStep(
  "fetchOrderWithMetadataStep",
  async (
    input: { orderId: string } & Record<string, any>,
    { container }: { container: any }
  ) => {
    console.log("[STEP] fetchOrderWithMetadataStep input.orderId:", input.orderId);
    const orderService = container.resolve("order")
    const order = await orderService.retrieve(input.orderId, {
      select: [
        "id",
        "metadata",
        "shipping_address",
        "subtotal",
        "total",
        "customer_id"
      ]
    })
    console.log("[STEP] Order retrieved from DB:", order);
    return new StepResponse({ ...input, order })
  }
)