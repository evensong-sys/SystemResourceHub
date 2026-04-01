import { QuartzComponent, QuartzComponentProps } from "./types"

const ToolGrid: QuartzComponent = (props: QuartzComponentProps) => {
  const tools = props.allFiles.filter(
    (f) =>
      f.slug?.startsWith("tools/") &&
      f.slug !== "tools/index"
  )

  // ✅ normalize type → always array of clean strings
  const getTypes = (t: any): string[] => {
    if (!t) return []
    const arr = Array.isArray(t) ? t : [t]
    return arr.map((x) => String(x).trim())
  }

  // ✅ build unique type list (ONLY from frontmatter.type)
  const types = Array.from(
    new Set(
      tools.flatMap((t) => getTypes(t.frontmatter?.type))
    )
  )

  return (
    <div>
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search tools..."
        className="tool-search"
      />

      {/* TYPE FILTER */}
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
              data-tags={(tool.frontmatter?.tags || []).join(",")}
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

      {/* EMPTY STATE */}
      <p className="tool-empty">No tools match your filters.</p>

      {/* SCRIPT */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  const search = document.querySelector(".tool-search");
  const typeButtons = document.querySelectorAll(".tool-filters [data-type]");
  const cards = document.querySelectorAll(".tool-card");
  const empty = document.querySelector(".tool-empty");

  let activeTypes = new Set(["all"]);

  function update() {
    const query = search.value.toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const title = card.querySelector("h3").innerText.toLowerCase();
      const desc = card.querySelector("p").innerText.toLowerCase();
      const typeAttr = card.getAttribute("data-type") || "";
      const cardTypes = typeAttr.split(",").map(t => t.trim());

      const matchesSearch =
        title.includes(query) || desc.includes(query);

      const matchesType =
        activeTypes.has("all") ||
        Array.from(activeTypes).every(t => cardTypes.includes(t));

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
      const type = btn.getAttribute("data-type");

      if (type === "all") {
        activeTypes = new Set(["all"]);
        typeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      } else {
        activeTypes.delete("all");
        const allBtn = document.querySelector('.tool-filters [data-type="all"]');
        if (allBtn) allBtn.classList.remove("active");

        if (activeTypes.has(type)) {
          activeTypes.delete(type);
          btn.classList.remove("active");
        } else {
          activeTypes.add(type);
          btn.classList.add("active");
        }

        if (activeTypes.size === 0) {
          activeTypes.add("all");
          if (allBtn) allBtn.classList.add("active");
        }
      }

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