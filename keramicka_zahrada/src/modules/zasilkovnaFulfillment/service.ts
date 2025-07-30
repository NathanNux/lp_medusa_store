import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import { FulfillmentOption, CreateFulfillmentResult, FulfillmentDTO, FulfillmentItemDTO, FulfillmentOrderDTO } from "@medusajs/framework/types"
import { randomUUID } from "crypto"
import { Builder, Parser } from "xml2js"

const API_KEY="1c80656ab4964dc5"

class PacketaProviderService extends AbstractFulfillmentProviderService {
  static identifier = "packeta"
  constructor({}, options) {
    super()
    // Inicializace klienta pro Packeta API, pokud potřebujete
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    // Zde můžete vracet výdejní místa, typy dopravy apod.
    return [
      { id: "packeta_pickup", name: "Zásilkovna - výdejní místo" }
    ]
  }

  async validateFulfillmentData(optionData, data, context) {
    console.log("Validating fulfillment data with optionData:", optionData, "data:", data, "context:", context);
    return data
  }

async createFulfillment(
  data: Record<string, unknown>,
  items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
  order: Partial<FulfillmentOrderDTO> | undefined,
  fulfillment: Partial<Omit<FulfillmentDTO, "provider_id" | "data" | "items">>
): Promise<CreateFulfillmentResult> {
  const apiPassword = "1c80656ab4964dc5f40d14a3d2412391"

  const customer = (order?.shipping_address ?? {}) as { first_name?: string; last_name?: string; phone?: string }
  const cod = order?.subtotal
  const value = order?.total
  const weight = items.reduce((sum, item) => sum + (item.quantity ?? 1) * ((item as any).weight ?? 1), 0)

  const addressId = data.pickup_point_id || 79


  
const requestBody = {
  createPacket: {
    apiPassword: "1c80656ab4964dc5f40d14a3d2412391",
    packetAttributes: {
      number: "orderNumber",
      name: "Jan",
      surname: "Veselý",
      company: "Keramická zahrada",
      email: "forejtovic@gmail.com", 
      sendLabelToEmail: true,
      phone: "+420776157476",
      addressId: 1817,
      cod: 115,
      value: 115,
      weight: 2.5,
      currency: "CZK",
      eshop: "keramickazahrada.cz", // only if you have multiple senders (under Indication / Označení)

    }
  }
}

  try {

    const response = await fetch(
        "https://www.zasilkovna.cz/api/rest",
        {
            method: "POST",
            body: new Builder().buildObject(requestBody)
        }
    );

    const responseBody = await new Parser({ explicitArray: false }).parseStringPromise(await response.text());

    // Always log the full response first!
    console.log("Full Packeta API response:", JSON.stringify(responseBody, null, 2));
    //process response
    console.log(responseBody.response.result.id);
    }
    catch (exception) {
        console.error("Packeta API exception:", exception);
    }





    // Výsledek fulfillmentu
    return {
      data: {
        ...data,
        packeta_response: "Response from Packeta API",
      },
      labels: []
    }
  }

  async cancelFulfillment(data) {
    // Zde voláte Packeta API pro zrušení zásilky
  }
}

export default PacketaProviderService