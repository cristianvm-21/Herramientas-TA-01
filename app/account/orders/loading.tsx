import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><Skeleton className="h-10 w-56" /><div className="mt-10 space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div></section>
}
