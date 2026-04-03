import { QuartzComponent, QuartzComponentProps } from "./types"

const ToolGrid: QuartzComponent = (props: QuartzComponentProps) => {
  const tools = props.allFiles.filter(
    (f) =>
      f.slug?.startsWith("tools/") &&
      f.slug !== "tools/index"
  )

  // normalize types
  const getTypes = (t: any): string[] => {
    if (!t) return []
    const arr = Array.isArray(t) ? t : [t]
    return arr.map((x) => String(x).trim())
  }

  const types = Array.from(
    new Set(
      tools.flatMap((t) => getTypes(t.frontmatter?.type))
    )
  )

  return (
    <div className="tool-root">
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search tools..."
        className="tool-search"
      />

      {/* FILTERS */}
      <div className="tool-filters">
        <button data-type="all" className="active">All</button>
        {types.map((type) => (
          <button key={type} data-type={type}>
            {type}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="tool-grid">
        {tools.map((tool) => {
          const toolTypes = getTypes(tool.frontmatter?.type)

          return (
            <a
              key={tool.slug}
              href={`/${tool.slug}`}
              className="tool-card"
              data-type={toolTypes.join(",")}
            >
              <div className="tool-card-header">
                {tool.frontmatter?.logo && (
                  <img src={tool.frontmatter.logo} alt="" />
                )}
                <h3>{tool.frontmatter?.title}</h3>
              </div>

              <p>{tool.frontmatter?.description}</p>
            </a>
          )
        })}
      </div>

      {/* EMPTY */}
      <p className="tool-empty" style={{ display: "none" }}>
        No tools match your filters.
      </p>

      {/* SCRIPT */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  function initToolGrid() {
    document.querySelectorAll(".tool-root").forEach((root) => {
      if (root.dataset.initialized === "true") return
      root.dataset.initialized = "true"

      const search = root.querySelector(".tool-search")
      const buttons = root.querySelectorAll(".tool-filters [data-type]")
      const cards = root.querySelectorAll(".tool-card")
      const empty = root.querySelector(".tool-empty")

      let activeTypes = new Set(["all"])

      function update() {
        const query = (search?.value || "").toLowerCase()
        let visible = 0

        cards.forEach((card) => {
          const title = card.querySelector("h3")?.innerText.toLowerCase() || ""
          const desc = card.querySelector("p")?.innerText.toLowerCase() || ""
          const typeAttr = card.getAttribute("data-type") || ""
          const cardTypes = typeAttr.split(",").map(t => t.trim())

          const matchesSearch =
            title.includes(query) || desc.includes(query)

          const matchesType =
            activeTypes.has("all") ||
            Array.from(activeTypes).every(t => cardTypes.includes(t))

          if (matchesSearch && matchesType) {
            card.classList.remove("hidden")
            visible++
          } else {
            card.classList.add("hidden")
          }
        })

        if (empty) {
          empty.style.display = visible === 0 ? "block" : "none"
        }
      }

      search?.addEventListener("input", update)

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const type = btn.getAttribute("data-type")

          if (type === "all") {
            activeTypes = new Set(["all"])
            buttons.forEach(b => b.classList.remove("active"))
            btn.classList.add("active")
          } else {
            activeTypes.delete("all")
            const allBtn = root.querySelector('[data-type="all"]')
            if (allBtn) allBtn.classList.remove("active")

            if (activeTypes.has(type)) {
              activeTypes.delete(type)
              btn.classList.remove("active")
            } else {
              activeTypes.add(type)
              btn.classList.add("active")
            }

            if (activeTypes.size === 0) {
              activeTypes.add("all")
              if (allBtn) allBtn.classList.add("active")
            }
          }

          update()
        })
      })

      update()
    })
  }

  // initial load
  document.addEventListener("DOMContentLoaded", initToolGrid)

  // Quartz navigation (CRITICAL)
  document.addEventListener("nav", initToolGrid)
})();
          `,
        }}
      />
    </div>
  )
}

export default ToolGrid