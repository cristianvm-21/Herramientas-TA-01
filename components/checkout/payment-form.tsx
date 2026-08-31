"use client"

import { CreditCard, LockKeyhole } from "lucide-react"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

import { createOrder } from "@/app/checkout/order-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getEmptyPaymentDetails, validatePaymentDetails, type PaymentDetails, type PaymentField } from "@/lib/payment/validation"
import { useCartStore } from "@/stores/cart-store"
import type { CartItem } from "@/types/cart"

type PaymentFormProps = {
  items: CartItem[]
  isShippingComplete: boolean
}

export function PaymentForm({ items, isShippingComplete }: PaymentFormProps) {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(getEmptyPaymentDetails)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<PaymentField, string>>>({})
  const [message, setMessage] = useState<string>()
  const [isProcessing, setIsProcessing] = useState(false)
  const clearCart = useCartStore((state) => state.clearCart)
  const router = useRouter()
  const isDisabled = !isShippingComplete || isProcessing

  function updateField(field: PaymentField, value: string) {
    setPaymentDetails((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(undefined)
    const validation = validatePaymentDetails(paymentDetails)

    if (!validation.isValid) {
      setFieldErrors(validation.fieldErrors)
      return
    }

    if (!isShippingComplete) {
      setMessage("Completa y guarda los datos de entrega antes de continuar.")
      return
    }

    setFieldErrors({})
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 900))

    try {
      const result = await createOrder(items.map(({ productId, quantity }) => ({ productId, quantity })))

      if (!result.orderId) {
        setMessage(result.message ?? "No se pudo registrar tu pedido. Inténtalo nuevamente.")
        return
      }

      setPaymentDetails(getEmptyPaymentDetails())
      clearCart()
      router.push(`/checkout/confirmation/${result.orderId}`)
      router.refresh()
    } catch {
      setMessage("No se pudo registrar tu pedido. Inténtalo nuevamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {message && <Alert className="border-destructive/30"><AlertDescription>{message}</AlertDescription></Alert>}
      {!isShippingComplete && (
        <Alert className="border-warning/30"><AlertDescription>Guarda todos los datos de entrega para habilitar el pago simulado.</AlertDescription></Alert>
      )}

      <div className="space-y-2">
        <label htmlFor="cardholderName" className="text-sm font-medium">Nombre del titular</label>
        <Input id="cardholderName" value={paymentDetails.cardholderName} onChange={(event) => updateField("cardholderName", event.target.value)} autoComplete="cc-name" disabled={isDisabled} aria-invalid={Boolean(fieldErrors.cardholderName)} required />
        {fieldErrors.cardholderName && <p className="text-sm text-destructive">{fieldErrors.cardholderName}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="cardNumber" className="text-sm font-medium">Número de tarjeta</label>
        <div className="relative"><CreditCard className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="cardNumber" value={paymentDetails.cardNumber} onChange={(event) => updateField("cardNumber", event.target.value)} inputMode="numeric" autoComplete="cc-number" maxLength={19} className="pl-9" disabled={isDisabled} aria-invalid={Boolean(fieldErrors.cardNumber)} required /></div>
        {fieldErrors.cardNumber && <p className="text-sm text-destructive">{fieldErrors.cardNumber}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="expirationDate" className="text-sm font-medium">Vencimiento</label>
          <Input id="expirationDate" value={paymentDetails.expirationDate} onChange={(event) => updateField("expirationDate", event.target.value)} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" maxLength={5} disabled={isDisabled} aria-invalid={Boolean(fieldErrors.expirationDate)} required />
          {fieldErrors.expirationDate && <p className="text-sm text-destructive">{fieldErrors.expirationDate}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="cvv" className="text-sm font-medium">CVV</label>
          <div className="relative"><LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="cvv" value={paymentDetails.cvv} onChange={(event) => updateField("cvv", event.target.value)} type="password" inputMode="numeric" autoComplete="cc-csc" maxLength={4} className="pl-9" disabled={isDisabled} aria-invalid={Boolean(fieldErrors.cvv)} required /></div>
          {fieldErrors.cvv && <p className="text-sm text-destructive">{fieldErrors.cvv}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isDisabled}>
        {isProcessing ? "Procesando pago simulado..." : "Confirmar pago simulado"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">Los datos de esta tarjeta son solo para la simulación y no se almacenan.</p>
    </form>
  )
}
