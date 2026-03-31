import { QuartzComponent, QuartzComponentProps } from "./types"

const ToolGrid: QuartzComponent = (props: QuartzComponentProps) => {
  const tools = props.allFiles.filter(
    (f) =>
      f.slug?.startsWith("tools/") &&
      f.slug !== "tools/index"
  )

  const types = Array.from(
    new Set(tools.map((t) => t.frontmatter?.type).filter(Boolean))
  )

  return (
    <div>
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search tools..."
        className="tool-search"
      />

      {/* TYPE FILTER (PRIMARY) */}
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
        {tools.map((tool) => (
          <a
            key={tool.slug}
            href={`/${tool.slug}`}
            className="tool-card"
            data-type={tool.frontmatter?.type}
            data-tags={(tool.frontmatter?.tags || []).join(",")}
          >
            <div className="tool-card-header">
              {tool.frontmatter?.logo && (
                <img src={tool.frontmatter.logo} alt="" />
              )}
              <h3>{tool.frontmatter?.title}</h3>
            </div>

            <p>{tool.frontmatter?.description}</p>

            <div className="tool-tags">
              {(tool.frontmatter?.tags || []).map((tag: string) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </a>
        ))}
      </div>

      {/* EMPTY STATE */}
      <p className="tool-empty">No tools match your filters.</p>

      {/* SCRIPT */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  const search = document.querySelector(".tool-search");
  const typeButtons = document.querySelectorAll("[data-type]");
  const cards = document.querySelectorAll(".tool-card");
  const empty = document.querySelector(".tool-empty");

  let activeType = "all";

  function update() {
    const query = search.value.toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const title = card.querySelector("h3").innerText.toLowerCase();
      const desc = card.querySelector("p").innerText.toLowerCase();
      const type = card.getAttribute("data-type");

      const matchesSearch =
        title.includes(query) || desc.includes(query);

      const matchesType =
        activeType === "all" || type === activeType;

      if (matchesSearch && matchesType) {
        card.classList.remove("hidden");
        visible++;
      } else {
        card.classList.add("hidden");
      }
    });

    empty.style.display = visible === 0 ? "block" : "none";
  }

  search.addEventListener("input", update);

  typeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      typeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      activeType = btn.getAttribute("data-type");
      update();
    });
  });

  update();
})();
          `,
        }}
      />
    </div>
  )
}

export default ToolGrid