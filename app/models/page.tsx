import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ModelCard from '@/components/ModelCard'
import { getAIModels, getPortalSettings, getMetafieldValue } from '@/lib/cosmic'
import { AIModel } from '@/types'

export const revalidate = 60

export default async function ModelsPage() {
  const [models, settings] = await Promise.all([
    getAIModels(),
    getPortalSettings(),
  ])

  const portalTitle =
    getMetafieldValue(settings?.metadata?.portal_title) || 'Agent 指令集'
  const tagline = getMetafieldValue(settings?.metadata?.tagline)

  const openaiModels = models.filter((m) =>
    getMetafieldValue(m.metadata?.provider).toLowerCase().includes('openai')
  )
  const anthropicModels = models.filter((m) =>
    getMetafieldValue(m.metadata?.provider).toLowerCase().includes('anthropic')
  )
  const otherModels = models.filter(
    (m) =>
      !getMetafieldValue(m.metadata?.provider)
        .toLowerCase()
        .match(/openai|anthropic/)
  )

  return (
    <>
      <Header title={portalTitle} tagline={tagline} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Available Models</h1>
          <p className="text-muted mt-2">
            {models.length} model{models.length === 1 ? '' : 's'} accessible
            through the OpenAI-compatible endpoint.
          </p>
        </div>

        {models.length === 0 && (
          <p className="text-muted">No models available yet.</p>
        )}

        {openaiModels.length > 0 && (
          <ModelSection
            title="OpenAI"
            colorClass="bg-openai"
            models={openaiModels}
          />
        )}

        {anthropicModels.length > 0 && (
          <ModelSection
            title="Anthropic"
            colorClass="bg-anthropic"
            models={anthropicModels}
          />
        )}

        {otherModels.length > 0 && (
          <ModelSection
            title="Other"
            colorClass="bg-muted"
            models={otherModels}
          />
        )}
      </main>

      <Footer />
    </>
  )
}

function ModelSection({
  title,
  colorClass,
  models,
}: {
  title: string
  colorClass: string
  models: AIModel[]
}) {
  if (!models || models.length === 0) return null

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className={`h-3 w-3 rounded-full ${colorClass}`} />
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <span className="text-sm text-muted">({models.length})</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </section>
  )
}