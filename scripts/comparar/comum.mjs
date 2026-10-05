// Peças comuns da comparação com o protótipo aprovado (reference/alpha-pro-lp.html).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
export const REF = 'file://' + path.join(RAIZ, 'reference/alpha-pro-lp.html')
export const URL_NOVO = process.env.URL || 'http://localhost:3000/'
export const SAIDA = path.join(RAIZ, '.comparar')
fs.mkdirSync(SAIDA, { recursive: true })

// O protótipo carrega a fonte do Google; aqui as duas páginas usam o mesmo arquivo local,
// e o aviso de cookies fica escondido (COOKIES=1 mostra).
const FONTE = path.join(RAIZ, 'node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2')
export const CSS = `@font-face{font-family:"Plus Jakarta Sans";src:url(file://${FONTE}) format("woff2");font-weight:200 800;font-display:block}
*,*::before,*::after{animation-play-state:paused!important;caret-color:transparent!important}nextjs-portal{display:none!important}
${process.env.COOKIES ? '' : '#ck,[data-aviso-cookies]{display:none!important}'}`
