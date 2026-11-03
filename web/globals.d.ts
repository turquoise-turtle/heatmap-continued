// esbuild inlines stylesheets as text (--loader:.css=text).
declare module "*.css" {
  const text: string;
  export default text;
}

// Provided by Anki's webview.
declare function pycmd(command: string): unknown;

declare var ReviewHeatmap: unknown;
