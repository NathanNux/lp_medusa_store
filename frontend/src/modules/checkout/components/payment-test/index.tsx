import { Badge } from "@medusajs/ui"

const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">Pozor:</span> Pouze pro testovací účely.
    </Badge>
  )
}

export default PaymentTest
