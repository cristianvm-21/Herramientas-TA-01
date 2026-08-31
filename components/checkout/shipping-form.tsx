"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

import {
  saveCheckoutShippingDetails,
  type CheckoutShippingFormState,
} from "@/app/checkout/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ShippingDetails, ShippingField } from "@/lib/checkout/shipping"

const initialState: CheckoutShippingFormState = {}

type ShippingFormProps = {
  shippingDetails: ShippingDetails
}

const fields: Array<{ name: ShippingField; label: string }> = [
  { name: "firstName", label: "Nombres" },
  { name: "lastName", label: "Apellidos" },
  { name: "department", label: "Departamento" },
  { name: "province", label: "Provincia" },
  { name: "district", label: "Distrito" },
  { name: "address", label: "Dirección" },
]

export function ShippingForm({ shippingDetails }: ShippingFormProps) {
  const [state, formAction, isPending] = useActionState(saveCheckoutShippingDetails, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      router.refresh()
    }
  }, [router, state])

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <Alert className={state.success ? "border-success/30" : "border-destructive/30"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ name, label }) => (
          <div key={name} className={name === "address" ? "space-y-2 sm:col-span-2" : "space-y-2"}>
            <label htmlFor={name} className="text-sm font-medium">{label}</label>
            <Input
              id={name}
              name={name}
              defaultValue={shippingDetails[name]}
              autoComplete={getAutocomplete(name)}
              aria-invalid={Boolean(state.fieldErrors?.[name])}
              required
            />
            {state.fieldErrors?.[name] && <p className="text-sm text-destructive">{state.fieldErrors[name]}</p>}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar datos de entrega"}
      </Button>
    </form>
  )
}

function getAutocomplete(field: ShippingField) {
  const autocomplete: Record<ShippingField, string> = {
    firstName: "given-name",
    lastName: "family-name",
    department: "address-level1",
    province: "address-level2",
    district: "address-level3",
    address: "street-address",
  }

  return autocomplete[field]
}
