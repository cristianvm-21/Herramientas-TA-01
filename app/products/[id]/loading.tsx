import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailLoading() { return <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><Skeleton className="mb-8 h-9 w-40" /><div className="grid gap-10 lg:grid-cols-2"><Skeleton className="aspect-square" /><div className="space-y-5"><Skeleton className="h-5 w-32" /><Skeleton className="h-20 w-full" /><Skeleton className="h-7 w-24" /><Skeleton className="h-28 w-full" /></div></div></section> }
