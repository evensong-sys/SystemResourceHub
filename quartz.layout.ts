import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import ToolSidebar from "./quartz/components/ToolSidebar"
import SidebarHeader from "./quartz/components/SidebarHeader"
import ToolGrid from "./quartz/components/ToolGrid"
import { RecentNotes } from "./quartz/components/RecentNotes"
import RecentToolCards from "./quartz/components/RecentToolCards"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "Submit a Resource": "/Submit-a-Resource",
      "Discord Community": "https://discord.gg/jceEv7s3At",
      "Support Us": "https://ko-fi.com/systemresourcehub",
    },
  }),
}

// SINGLE PAGE LAYOUT
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [],
  left: [
    SidebarHeader,
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [ToolSidebar],
  
    afterBody: [
	  RecentToolCards(),
	],
}

// LIST PAGE LAYOUT (THIS is your tools page)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [], 

  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],

  right: [],
  
  afterBody: [
    (props) => {
      if (props.fileData.slug === "tools/index") {
        return ToolGrid(props)
      }
      return null
    },
  ],
}