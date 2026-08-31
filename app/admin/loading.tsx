import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><Skeleton className="h-10 w-56" /><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div></section>
}
