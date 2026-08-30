import { Star } from "lucide-react"

type ProductRatingProps = {
  rate: number
  count: number
}

export function ProductRating({ rate, count }: ProductRatingProps) {
  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
      <span className="font-medium text-foreground">{rate.toFixed(1)}</span>
      <span>({count})</span>
    </div>
  )
}
