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
     * Specify the port that server listen on.
     * @default 3000
     */
    port: number

    /**
     * Whether open the browser when dev server start to running.
     * @default false
     */
    open: boolean
  }

  /**
   * Specify output dir.
   * @default 'dist'
   */
  outputDir: 'dist'

  /**
   * Specify PDF generator options
   */
  PDFOptions: PDFOptions
}>
