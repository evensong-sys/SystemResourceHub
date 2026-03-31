import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function ToolMeta(props: QuartzComponentProps) {
  try {
    const fm = props?.fileData?.frontmatter

    if (!fm || !fm.type) return null

    return (
      <div class="tool-meta">

        <div class="meta-pair">
          <span class="meta-label">Type</span>
          <span class="meta-value">{fm.type}</span>
        </div>

        <div class="meta-pair">
          <span class="meta-label">Platform</span>
          <span class="meta-value">{fm.platform ?? "—"}</span>
        </div>

        <div class="meta-pair">
          <span class="meta-label">License</span>
          <span class="meta-value">
            {fm.license?.url ? (
              <a href={fm.license.url} target="_blank">
                {fm.license.name}
              </a>
            ) : (
              fm.license?.name ?? "—"
            )}
          </span>
        </div>

        <div class="meta-pair">
          <span class="meta-label">Cost</span>
          <span class="meta-value">{fm.cost ?? "Free"}</span>
        </div>

        <div class="meta-pair">
          <span class="meta-label">Status</span>
          <span class="meta-value">{fm.status ?? "—"}</span>
        </div>

      </div>
    )
  } catch (e) {
    console.error("ToolMeta error:", e)
    return null
  }
}

export default (() => ToolMeta) satisfies QuartzComponentConstructor