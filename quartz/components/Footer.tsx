import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? {}

    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          © {year} System Resource Hub · Powered by{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz</a>
        </p>
		<p className="footer-tagline">
          Helping plural systems find the tools they need.
        </p>

        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li key={text}>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor