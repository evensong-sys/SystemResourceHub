import { QuartzComponentConstructor } from "./types"
import { marked } from "marked"

const ToolSidebar: QuartzComponentConstructor = ({ fileData }) => {
  const fm = fileData.frontmatter
  if (!fm) return null

  const links = fm.links || {}
  const dev = fm.developer || {}
  const meta = fm.meta || {}

  const hasLinks = Object.keys(links).length > 0
  const hasMeta = Object.keys(meta).length > 0

  // Convert Markdown → HTML string
  const descriptionHTML = fm.description
    ? marked.parse(fm.description)
    : ""

  return (
    <aside className="tool-sidebar">

      {/* DESCRIPTION */}
      {fm.description && (
        <div className="tool-section">
          <h3>About</h3>
          <div
            className="tool-description"
            dangerouslySetInnerHTML={{ __html: descriptionHTML }}
          />
        </div>
      )}

      {/* DEVELOPER */}
      {dev.name && (
        <div className="tool-section">
          <h3>Developer</h3>

          {dev.url ? (
            <a
              href={dev.url}
              target="_blank"
              rel="noopener noreferrer"
              className="developer-link"
            >
              {dev.name}
            </a>
          ) : (
            <span className="developer-link">{dev.name}</span>
          )}
        </div>
      )}

      {/* LINKS */}
      {hasLinks && (
        <div className="tool-section">
          <h3>Links</h3>
          <div className="tool-links">

            {links.web && (
              <a href={links.web} target="_blank" rel="noopener noreferrer" title="Website">
                <i className="fa-solid fa-globe"></i>
              </a>
            )}

            {links.google && (
              <a href={links.google} target="_blank" rel="noopener noreferrer" title="Google Play">
                <i className="fa-brands fa-google-play"></i>
              </a>
            )}

            {links.apple && (
              <a href={links.apple} target="_blank" rel="noopener noreferrer" title="App Store">
                <i className="fa-brands fa-apple"></i>
              </a>
            )}

            {links.discord && (
              <a href={links.discord} target="_blank" rel="noopener noreferrer" title="Discord">
                <i className="fa-brands fa-discord"></i>
              </a>
            )}

            {links.github && (
              <a href={links.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                <i className="fa-brands fa-github"></i>
              </a>
            )}

          </div>
        </div>
      )}

      {/* META */}
      {hasMeta && (
        <div className="tool-section">
          <h3>Details</h3>

          <div className="sidebar-meta-list">

            {meta.type && (
              <div className="sidebar-meta-pair">
                <span className="sidebar-meta-label">Type</span>
                <span className="sidebar-meta-value">{meta.type}</span>
              </div>
            )}

            {meta.platform && (
              <div className="sidebar-meta-pair">
                <span className="sidebar-meta-label">Platform</span>
                <span className="sidebar-meta-value">
                  {Array.isArray(meta.platform)
                    ? meta.platform.join(", ")
                    : meta.platform}
                </span>
              </div>
            )}

            {meta.license && (
              <div className="sidebar-meta-pair">
                <span className="sidebar-meta-label">License</span>
                <span className="sidebar-meta-value">
                  {meta.license.url ? (
                    <a href={meta.license.url} target="_blank" rel="noopener noreferrer">
                      {meta.license.name}
                    </a>
                  ) : (
                    meta.license.name
                  )}
                </span>
              </div>
            )}

            {meta.cost && (
              <div className="sidebar-meta-pair">
                <span className="sidebar-meta-label">Cost</span>
                <span className="sidebar-meta-value">{meta.cost}</span>
              </div>
            )}

            {meta.status && (
              <div className="sidebar-meta-pair">
                <span className="sidebar-meta-label">Status</span>
                <span className="sidebar-meta-value">{meta.status}</span>
              </div>
            )}

          </div>
        </div>
      )}

      {/* DATES */}
      {(fileData.dates?.created || fileData.dates?.modified) && (
        <div className="tool-section tool-dates">
          <p>
            <strong>{fm.title}</strong> added on{" "}
            {fileData.dates?.created &&
              new Date(fileData.dates.created).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            {fileData.dates?.modified && (
              <>
                . Last modified on{" "}
                {new Date(fileData.dates.modified).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </>
            )}
            .
          </p>
        </div>
      )}

    </aside>
  )
}

export default ToolSidebar