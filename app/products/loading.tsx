import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><Skeleton className="h-9 w-40" /><Skeleton className="mt-3 h-5 w-80" /><Skeleton className="mt-8 h-17 w-full" /><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <Skeleton key={index} className="h-96" />)}</div></section>
}
