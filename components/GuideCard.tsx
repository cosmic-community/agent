import { SetupGuide } from '@/types'
import { getMetafieldValue } from '@/lib/cosmic'

interface GuideCardProps {
  guide: SetupGuide
}

export default function GuideCard({ guide }: GuideCardProps) {
  const stepNumber = getMetafieldValue(guide.metadata?.step_number)
  const stepTitle = getMetafieldValue(guide.metadata?.step_title) || guide.title
  const stepContent = getMetafieldValue(guide.metadata?.step_content)
  const icon = getMetafieldValue(guide.metadata?.icon)
  const clientName = getMetafieldValue(guide.metadata?.client_name)

  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex gap-4 hover:border-accent/50 transition-colors">
      <div className="shrink-0">
        <div className="h-12 w-12 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-bold text-lg">
          {icon ? <span className="text-2xl">{icon}</span> : stepNumber || '•'}
        </div>
      </div>
      <div className="min-w-0">
        {clientName && (
          <div className="text-xs text-accent font-medium mb-1 uppercase tracking-wide">
            {clientName}
          </div>
        )}
        <h3 className="font-semibold text-foreground text-base leading-tight">
          {stepNumber && (
            <span className="text-muted mr-1">Step {stepNumber}:</span>
          )}
          {stepTitle}
        </h3>
        {stepContent && (
          <div
            className="text-sm text-muted mt-2 leading-relaxed prose-content"
            dangerouslySetInnerHTML={{ __html: stepContent }}
          />
        )}
      </div>
    </div>
  )
}