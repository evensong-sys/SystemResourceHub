import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import ToolMeta from "./ToolMeta"
import ToolReviews from "./ToolReviews"

function ToolHeader(props: QuartzComponentProps) {
  const fm = props.fileData.frontmatter

  return (
    <>
      <div class="tool-header">

        <img src={fm?.icon} class="tool-icon" />

        <div class="tool-content">
          <h1>{fm?.title}</h1>

          {fm?.type && <ToolMeta {...props} />}

          <p class="tool-desc">
            {fm?.description}
          </p>
        </div>

      </div>

      {/* ⭐ THIS is where reviews render */}
      <ToolReviews {...props} />
    </>
  )
}

export default (() => ToolHeader) satisfies QuartzComponentConstructor