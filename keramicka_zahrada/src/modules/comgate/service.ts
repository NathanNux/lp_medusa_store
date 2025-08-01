import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import { CancelPaymentInput, CancelPaymentOutput, DeletePaymentInput, DeletePaymentOutput, GetPaymentStatusInput, GetPaymentStatusOutput, InitiatePaymentInput, InitiatePaymentOutput, ProviderWebhookPayload, RetrievePaymentInput, RetrievePaymentOutput, UpdatePaymentInput, UpdatePaymentOutput, WebhookActionResult } from "@medusajs/types"

type Options = { apiKey: string }

class ComgatePaymentProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "comgate"

  constructor(container, options: Options) {
    super(container, options)
    // Inicializujte klienta Comgate zde, pokud je potřeba
  }

    async authorizePayment(data: any): Promise<any> {
        // Implementujte logiku pro autorizaci platby
        return { success: true, data }
    }

    async capturePayment(data: any): Promise<any> {
        // Implementujte logiku pro zachycení platby
        return { success: true, data }
    }

    async refundPayment(data: any): Promise<any> {
        // Implementujte logiku pro refundaci platby
        return { success: true, data }
    }

    // service.ts
    async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
        console.log("Initiating payment with input:", input)
    // 1. Zavolej Comgate API pro vytvoření platby
    const response = await fetch("https://api.comgate.cz/create", {
        method: "POST",
        body: JSON.stringify({
        price: input.amount,
        currency: input.currency_code.toUpperCase(),
        method: "ALL",
        country: input.data?.country || "CZ",
        merchant: "your_merchant_id", // Zadejte svůj Comgate merchant ID
        label: input.data?.label || "Payment for order",
        refId: input.data?.order_id || "order123",
        // ...další parametry podle Comgate API...
        }),
        headers: { "Content-Type": "application/json" }
    })
    const data = await response.json()

    // 2. Ulož paymentId a URL do Medusa payment objektu
    return {
        data: {
        paymentId: data.transId,
        redirectUrl: data.redirect, // nebo jak se pole jmenuje
        },
        id: data.transId,
    }
    }

    async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
        // Implementujte logiku pro smazání platby
        return {}
    }

    async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
        // Implementujte logiku pro získání stavu platby
        return { status: "authorized"}
    }

    async getPaymentDetails(paymentId: string): Promise<any> {
        // Implementujte logiku pro získání detailů platby
        return { success: true, paymentId }
    }

    async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
        // Implementujte logiku pro aktualizaci platby
        return { data: input.data}
    }

    async getWebhookActionAndData(data: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
        // Implementujte logiku pro zpracování webhooku
        return { action: "authorized"}
    }

    async createPayment(data: any): Promise<any> {
        // Implementujte logiku pro vytvoření platby
        return { success: true, data }
    }

    async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
        // Implementujte logiku pro získání platby
        return { }
    }


    async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
        return {
            
            }    
    }

  // Zde implementujte potřebné metody pro autorizaci, zachycení, refund atd.
}

export default ComgatePaymentProviderService