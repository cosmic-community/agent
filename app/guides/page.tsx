import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GuideCard from '@/components/GuideCard'
import { getSetupGuides, getPortalSettings, getMetafieldValue } from '@/lib/cosmic'

export const revalidate = 60

export default async function GuidesPage() {
  const [guides, settings] = await Promise.all([
    getSetupGuides(),
    getPortalSettings(),
  ])

  const portalTitle =
    getMetafieldValue(settings?.metadata?.portal_title) || 'Agent 指令集'
  const tagline = getMetafieldValue(settings?.metadata?.tagline)

  return (
    <>
      <Header title={portalTitle} tagline={tagline} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Setup Guides</h1>
          <p className="text-muted mt-2">
            Follow these steps to connect your client (CherryStudio) to the API.
          </p>
        </div>

        {guides.length > 0 ? (
          <div className="grid gap-4 max-w-3xl">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No setup guides available yet.</p>
        )}
      </main>

      <Footer />
    </>
  )
}