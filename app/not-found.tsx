import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() { return <section className="mx-auto grid min-h-96 max-w-7xl place-items-center px-4 py-16 text-center"><div><p className="text-sm font-semibold text-primary">404</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Página no encontrada</h1><p className="mt-3 text-muted-foreground">El recurso solicitado no está disponible.</p><Link href="/products" className={buttonVariants({ className: "mt-6" })}>Ver productos</Link></div></section> }
