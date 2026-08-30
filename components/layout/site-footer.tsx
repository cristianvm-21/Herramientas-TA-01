import siteConfig from "@/site.config.mjs"

export function SiteFooter() {
  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
        <p>{siteConfig.footerText}</p>
        <p>Productos proporcionados por Fake Store API.</p>
      </div>
    </footer>
  )
}
