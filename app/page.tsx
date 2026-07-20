import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HealthStatus from '@/components/HealthStatus'
import CopyButton from '@/components/CopyButton'
import EndpointCard from '@/components/EndpointCard'
import ModelCard from '@/components/ModelCard'
import GuideCard from '@/components/GuideCard'
import Link from 'next/link'
import { getAIModels, getPortalSettings, getSetupGuides, getMetafieldValue } from '@/lib/cosmic'
import { EndpointItem } from '@/types'

export const revalidate = 60

function parseEndpoints(raw: EndpointItem[] | string | undefined): EndpointItem[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as EndpointItem[]
    } catch {
      return []
    }
  }
  return []
}

export default async function HomePage() {
  const [models, settings, guides] = await Promise.all([
    getAIModels(),
    getPortalSettings(),
    getSetupGuides(),
  ])

  const portalTitle =
    getMetafieldValue(settings?.metadata?.portal_title) || 'Agent 指令集'
  const tagline =
    getMetafieldValue(settings?.metadata?.tagline) ||
    'OpenAI Compatible Reverse Proxy API'
  const baseUrlNote = getMetafieldValue(settings?.metadata?.base_url_note)
  const apiKeyInstructions = getMetafieldValue(
    settings?.metadata?.api_key_instructions
  )
  const healthPath =
    getMetafieldValue(settings?.metadata?.health_check_path) || '/api/healthz'

  let endpoints = parseEndpoints(settings?.metadata?.endpoints)
  if (endpoints.length === 0) {
    endpoints = [
      { method: 'GET', path: '/v1/models', description: 'List available models' },
      {
        method: 'POST',
        path: '/v1/chat/completions',
        description: 'OpenAI-compatible chat completions (streaming supported)',
      },
    ]
  }

  const featuredModels = models.slice(0, 6)
  const featuredGuides = guides.slice(0, 4)

  return (
    <>
      <Header title={portalTitle} tagline={tagline} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <section className="py-14 sm:py-20 text-center">
          <div className="flex justify-center mb-5">
            <HealthStatus healthPath={healthPath} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            {portalTitle}
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            {tagline}
          </p>

          <div className="mt-8 max-w-xl mx-auto rounded-xl border border-border bg-surface p-4 text-left">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Base URL
              </span>
              <BaseUrlCopy />
            </div>
            <BaseUrlDisplay />
            {baseUrlNote && (
              <p className="text-xs text-muted mt-3">{baseUrlNote}</p>
            )}
          </div>
        </section>

        {/* Endpoints */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-foreground">API Endpoints</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {endpoints.map((ep, i) => (
              <EndpointCard
                key={`${ep.path}-${i}`}
                method={ep.method || 'GET'}
                path={ep.path || ''}
                description={ep.description}
              />
            ))}
          </div>
        </section>

        {/* API Key */}
        {apiKeyInstructions && (
          <section className="py-8">
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-foreground">API Key</h2>
              </div>
              <div
                className="text-sm text-muted leading-relaxed prose-content"
                dangerouslySetInnerHTML={{ __html: apiKeyInstructions }}
              />
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <code className="code-block text-sm bg-background border border-border rounded px-3 py-2 text-foreground">
                  Authorization: Bearer YOUR_API_KEY
                </code>
                <CopyButton
                  value="Authorization: Bearer YOUR_API_KEY"
                  label="Copy header"
                />
              </div>
            </div>
          </section>
        )}

        {/* Models */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-foreground">Available Models</h2>
            <Link
              href="/models"
              className="text-sm text-accent hover:underline"
            >
              View all →
            </Link>
          </div>
          {featuredModels.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <p className="text-muted">No models available yet.</p>
          )}
        </section>

        {/* Guides */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-foreground">Setup Guide</h2>
            <Link
              href="/guides"
              className="text-sm text-accent hover:underline"
            >
              View all →
            </Link>
          </div>
          {featuredGuides.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredGuides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          ) : (
            <p className="text-muted">No setup guides available yet.</p>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}

function BaseUrlDisplay() {
  return (
    <code
      className="code-block block text-sm text-accent bg-background border border-border rounded px-3 py-2 break-all"
      suppressHydrationWarning
    >
      <span id="base-url-text">Loading…</span>
    </code>
  )
}

function BaseUrlCopy() {
  return <ClientBaseUrl />
}

// Client component inline for base URL
function ClientBaseUrl() {
  return <BaseUrlClient />
}

// Re-export from a client boundary
import BaseUrlClient from '@/components/BaseUrlClient'