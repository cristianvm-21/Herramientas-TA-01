import { Skeleton } from "@/components/ui/skeleton"

export default function CartLoading() { return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><Skeleton className="h-9 w-28" /><Skeleton className="mt-3 h-5 w-72" /><div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"><Skeleton className="h-96" /><Skeleton className="h-64" /></div></section> }
