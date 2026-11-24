/**
 * Declaracao de tipos para o build legado do pdf.js (v3), que nao traz
 * arquivo .d.ts em `build/pdf.js`. Usamos apenas a API que as ferramentas
 * consomem: carregar documento, ler paginas, renderizar em canvas.
 */
declare module 'pdfjs-dist/build/pdf' {
  export const GlobalWorkerOptions: { workerSrc: string };
  export const version: string;
  export function getDocument(src: { data: ArrayBuffer } | string): {
    promise: Promise<{
      numPages: number;
      getPage(n: number): Promise<{
        getViewport(opts: { scale: number }): { width: number; height: number };
        render(opts: { canvasContext: CanvasRenderingContext2D; viewport: unknown }): { promise: Promise<void> };
      }>;
    }>;
  };
}
