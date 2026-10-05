// Página inteira, protótipo x site: altura de cada seção e print completo.
// Uso: pnpm comparar:alturas   (com o site rodando em http://localhost:3000)
import { chromium } from 'playwright'

import { CSS, REF, SAIDA, URL_NOVO } from './comum.mjs'

const b = await chromium.launch({ args: ['--allow-file-access-from-files'] })
for (const w of [390, 1440]) {
  for (const [tipo, url] of [['ref', REF], ['novo', URL_NOVO]]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } })
    const erros = []
    p.on('pageerror', (e) => erros.push(e.message))
    await p.goto(url, { waitUntil: 'load', timeout: 120000 })
    await p.addStyleTag({ content: CSS })
    await p.waitForTimeout(1500)
    // Rola até o fim para disparar o que só aparece ao rolar.
    const h = await p.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < h; y += 400) {
      await p.evaluate((y) => window.scrollTo(0, y), y)
      await p.waitForTimeout(120)
    }
    await p.waitForTimeout(2500)
    await p.evaluate(() => window.scrollTo(0, 0))
    await p.waitForTimeout(800)
    const secoes = await p.evaluate(() =>
      [...document.querySelectorAll('section,footer')]
        .map((s) => `${s.id || s.className.split(' ')[0]}:${Math.round(s.getBoundingClientRect().height)}`)
        .join(' '),
    )
    console.log(tipo, w, 'altura', h, erros.length ? 'ERROS ' + erros.join(' | ') : '', '\n ', secoes)
    await p.screenshot({ path: `${SAIDA}/pagina-${w}-${tipo}.png`, fullPage: true })
    await p.close()
  }
}
await b.close()
console.log('Prints em', SAIDA)
