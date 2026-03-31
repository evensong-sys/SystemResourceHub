import { QuartzComponent } from "./types"

const SidebarHeader: QuartzComponent = (props) => {
  const title =
    props.fileData?.frontmatter?.title ??
    props.fileData?.slug ??
    "System Resource Hub"

  return (
    <div className="sidebar-header">
      <a href="/" className="sidebar-logo">
        <img src="https://file.garden/ablfJEO_5VmXicbZ/SRH%20assets/SRHLogo.png" alt="System Resource Hub" />
      </a>

      <div className="sidebar-title">
        <h1>
		  <a href="/SystemResourceHub/">System Resource Hub</a>
		</h1>
      </div>
    </div>
  )
}

export default SidebarHeader