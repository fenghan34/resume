import { PDFOptions } from 'puppeteer'

type SourceUrl = `${string}.json` | `${'http' | 'https'}://${string}`

type Source = Readonly<{
  [language: string]: SourceUrl
}>

export type Config = Readonly<{
  /**
   * Define specific language resume source.
   */
  source: Source

  devServer?: {
    /**
     * Specify the port that dev server running on.
     * @default 3333
     */
    port?: number

    /**
     * Specify the port that websocket server running on.
     * @default 4444
     */
    socketPort?: number

    /**
     * Whether open the browser when dev server start to running.
     * @default false
     */
    open?: boolean
  }

  /**
   * Specify output dir.
   * @default "dist"
   */
  outputDir?: string

  /**
   * Specify locales dir.
   * @default "locale"
   */
  localeDir?: string

  /**
   * Specify style file path.
   * @default "theme.css"
   */
  styleFile: string

  /**
   * Specify template file path.
   * @default "template.hbs"
   */
  templateFile?: string

  /**
   * Specify PDF generator options
   */
  PDFOptions?: PDFOptions

  /**
   *  Specify the domain of online version
   */
  domain: string
}>
