'use client'

import { useEffect } from 'react'

interface Props {
 onPointSelected: (point: any) => void
}

export default function PacketaWidget({ onPointSelected }: Props) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://widget.packeta.com/v6/www/js/library.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  const handleOpenWidget = () => {
    if (!window.Packeta || !window.Packeta.Widget) {
      console.error('Widget is not loaded yet')
      return
    }

    const packetaApiKey = '1c80656ab4964dc5'

const packetaOptions = {
              language: "en",
              valueFormat: "\"Packeta\",id,carrierId,carrierPickupPointId,name,city,street", 
  view: "modal", 
  vendors: [
   { 
    country: "cz"
   },
   { 
    country: "hu"
   },
   { 
    country: "sk"
   },
   { 
    country: "ro"
   },
   { 
    country: "cz", 
    group: "zbox"
   },
   { 
    country: "sk", 
    group: "zbox"
   },
   { 
    country: "hu", 
    group: "zbox"
   },
   { 
    country: "pl"
   },
   { 
    country: "ro", 
    group: "zbox"
   }
  ]
          };
                
          function showSelectedPickupPoint(point:any) {
              const saveElement:any = document.querySelector(".packeta-selector-value");
              // Add here an action on pickup point selection
              saveElement.innerText = '';
              if (point) {
                console.log("Selected point", point);
                saveElement.innerText = "Address2: " + point.formatedValue; 
                const parts = point.formatedValue.split(",");
                const number = parts[1]?.trim(); // druhý prvek (index 1)
                console.log("Číslo výdejního místa:", number);
                onPointSelected(number);
              }
          }

    window.Packeta.Widget.pick(packetaApiKey, showSelectedPickupPoint, packetaOptions)
  }

  return (
    <div>
      <button
        onClick={handleOpenWidget}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Vybrat výdejní místo
      </button>
    </div>
  )
}
