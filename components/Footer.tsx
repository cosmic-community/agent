export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-muted">
        <p>
          Agent 指令集 &mdash; OpenAI Compatible API Portal &copy; {year}
        </p>
        <p className="mt-1 text-xs">
          Content managed with Cosmic
        </p>
      </div>
    </footer>
  )
}