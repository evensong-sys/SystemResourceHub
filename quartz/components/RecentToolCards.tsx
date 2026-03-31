import { QuartzComponent, QuartzComponentConstructor } from "./types"

const RecentToolCards: QuartzComponent = (props) => {
  const { allFiles, fileData } = props

  // only show on homepage
  if (!fileData || fileData.slug !== "index") return <></>

  const getDate = (f: any) => {
    if (f.frontmatter?.created) return new Date(f.frontmatter.created).getTime()
    if (f.frontmatter?.modified) return new Date(f.frontmatter.modified).getTime()
    if (f.dates?.modified) return new Date(f.dates.modified).getTime()
    return 0
  }

  const tools = (allFiles ?? [])
    .filter((f: any) => typeof f.slug === "string" && f.slug.startsWith("tools/"))
    .sort((a: any, b: any) => getDate(b) - getDate(a))
    .slice(0, 3)

  if (tools.length === 0) return <></>

  return (
    <div className="recent-tools">
      <h2>Recently Added</h2>

      <div className="tool-grid">
        {tools.map((tool: any) => {
          const title = tool.frontmatter?.title ?? "Untitled"
          const description = tool.frontmatter?.description ?? ""
          const logo = tool.frontmatter?.logo ?? null
          const href = "/" + tool.slug

          return (
            <a href={href} className="tool-card">
              {logo ? (
                <img
                  src={logo}
                  alt={title}
                  className="tool-logo"
                />
              ) : (
                <div className="tool-fallback">🔧</div>
              )}

              <div className="tool-info">
                <h3>{title}</h3>
                {description && <p>{description}</p>}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default (() => RecentToolCards) satisfies QuartzComponentConstructor