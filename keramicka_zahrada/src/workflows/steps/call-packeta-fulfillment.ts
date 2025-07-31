import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import type { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"

export const callPacketaFulfillmentStep = createStep(
  "callPacketaFulfillmentStep",
  async (input: any, { container }) => {
        console.log("Input data:", input)

    const packetaProvider = container.resolve(
      "packetaFulfillmentService"
    ) as AbstractFulfillmentProviderService

    const result = await packetaProvider.createFulfillment(
      input.data,
      input.items,
      input.order,
      input.fulfillment
    )

    // Wrap the result in StepResponse
    return new StepResponse(result)
  }
)