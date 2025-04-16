import { ExecArgs } from "@medusajs/framework/types";
import { Modules, ProductStatus } from "@medusajs/framework/utils";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function createProductScript({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  
  // Získání shipping profile ID (potřebné pro produkt)
  const shippingProfileService:any = container.resolve("shippingProfile");
  const shippingProfiles = await shippingProfileService.list({});
  const shippingProfileId = shippingProfiles[0]?.id;
  
  if (!shippingProfileId) {
    logger.error("Nebyl nalezen žádný shipping profile. Spusťte nejprve seed.ts.");
    return;
  }
  
  // Získání sales channel ID
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL);
  const salesChannels = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  });
  
  if (!salesChannels.length) {
    logger.error("Nebyl nalezen Default Sales Channel. Spusťte nejprve seed.ts.");
    return;
  }
  
  const salesChannelId = salesChannels[0].id;
  
  // Vytvoření produktu
  logger.info("Vytvářím nový produkt...");
  
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Nový produkt",
          description: "Popis nového produktu",
          handle: "novy-produkt",
          status: ProductStatus.PUBLISHED,
          weight: 500,
          shipping_profile_id: shippingProfileId,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
            }
          ],
          options: [
            {
              title: "Velikost",
              values: ["S", "M", "L"],
            },
            {
              title: "Barva",
              values: ["Černá", "Bílá"],
            },
          ],
          variants: [
            {
              title: "S / Černá",
              sku: "NOVY-S-CERNA",
              options: {
                Velikost: "S",
                Barva: "Černá",
              },
              prices: [
                {
                  amount: 590,
                  currency_code: "eur",
                },
                {
                  amount: 690,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "M / Černá",
              sku: "NOVY-M-CERNA",
              options: {
                Velikost: "M",
                Barva: "Černá",
              },
              prices: [
                {
                  amount: 590,
                  currency_code: "eur",
                },
                {
                  amount: 690,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "S / Bílá",
              sku: "NOVY-S-BILA",
              options: {
                Velikost: "S",
                Barva: "Bílá",
              },
              prices: [
                {
                  amount: 590,
                  currency_code: "eur",
                },
                {
                  amount: 690,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: salesChannelId,
            },
          ],
        },
      ],
    },
  });
  
  logger.info("Produkt úspěšně vytvořen!");
}