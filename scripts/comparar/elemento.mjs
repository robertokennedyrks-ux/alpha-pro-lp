// Um trecho lado a lado: print do mesmo elemento no protótipo e no site.
// Uso: pnpm comparar <nome> <seletor-no-protótipo> <seletor-no-site> [larguras=390,800,1440]
// Seletor "-" pula aquele lado. Ex.: pnpm comparar oferta "#oferta" "#oferta"
import path from 'node:path'

import { chromium } from 'playwright'

import { CSS, REF, SAIDA, URL_NOVO } from './comum.mjs'

const [nome, selRef, selNovo, larguras = '390,800,1440'] = process.argv.slice(2)
if (!nome || !selRef || !selNovo) {
  console.log('Uso: pnpm comparar <nome> <seletor-no-protótipo> <seletor-no-site> [larguras]')
  process.exit(1)
}

const b = await chromium.launch({ args: ['--allow-file-access-from-files'] })
for (const w of larguras.split(',').map(Number)) {
  for (const [tipo, url, sel] of [['ref', REF, selRef], ['novo', URL_NOVO, selNovo]]) {
    if (sel === '-') continue
    const p = await b.newPage({ viewport: { width: w, height: 900 } })
    const erros = []
    p.on('pageerror', (e) => erros.push(e.message))
    p.on('console', (m) => m.type() === 'error' && !/fonts\.g|net::|Not allowed to load local resource/.test(m.text()) && erros.push(m.text()))
    await p.goto(url, { waitUntil: 'load', timeout: 120000 })
    await p.addStyleTag({ content: CSS })
    await p.evaluate(() => document.fonts.ready)
    const el = p.locator(sel).first()
    if (!(await el.count())) {
      console.log(`${tipo} ${w}: seletor não encontrado: ${sel}`)
      await p.close()
      continue
    }
    await el.scrollIntoViewIfNeeded()
    await p.waitForTimeout(1200)
    const arquivo = path.join(SAIDA, `${nome}-${w}-${tipo}.png`)
    await el.screenshot({ path: arquivo, animations: 'disabled' })
    const box = await el.boundingBox()
    console.log(`${tipo} ${w}: ${arquivo} (${Math.round(box.width)}x${Math.round(box.height)})${erros.length ? ' ERROS: ' + erros.join(' | ') : ''}`)
    await p.close()
  }
}
await b.close()
