import { CheckoutPageContent } from "@/components/checkout/checkout-page-content"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { requireUser } from "@/lib/auth"
import { getEmptyShippingDetails } from "@/lib/checkout/shipping"
import { toProfile, type ProfileRow } from "@/lib/supabase/profiles"
import { createClient } from "@/lib/supabase/server"

export default async function CheckoutPage() {
  const user = await requireUser("/checkout")
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const profile = data && !error ? toProfile(data as ProfileRow) : null
  const shippingDetails = profile
    ? {
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        department: profile.department ?? "",
        province: profile.province ?? "",
        district: profile.district ?? "",
        address: profile.address ?? "",
      }
    : getEmptyShippingDetails()

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-2 text-muted-foreground">Revisa tu pedido y confirma tus datos de entrega.</p>
      </div>
      {!profile && (
        <Alert className="mb-6 border-warning/30">
          <AlertTitle>Perfil no disponible</AlertTitle>
          <AlertDescription>Puedes completar los datos de entrega, pero será necesario resolver el perfil antes de crear un pedido.</AlertDescription>
        </Alert>
      )}
      <CheckoutPageContent shippingDetails={shippingDetails} profileLoadFailed={Boolean(error)} />
    </section>
  )
}
