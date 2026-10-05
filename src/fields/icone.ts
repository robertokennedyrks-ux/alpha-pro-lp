import type { SelectField } from 'payload'

import { icons } from '@/components/icons/catalog'

// Seletor com os ícones do catálogo único (src/components/icons/catalog.ts).
export const campoIcone = (overrides: { name?: string; label?: string; required?: boolean } = {}): SelectField => ({
  name: 'icone',
  label: 'Ícone',
  type: 'select',
  options: Object.entries(icons).map(([value, def]) => ({
    value,
    label: def.label ? `${def.label} (${value})` : value,
  })),
  ...overrides,
})
