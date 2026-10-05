import React from 'react'

import { icons, type IconName } from './catalog'

export type { IconName }

type Props = React.SVGProps<SVGSVGElement> & { name: IconName; title?: string }

// Ícones em linha, cor herdada (currentColor), pontas e junções arredondadas.
export function Icon({ name, title, ...rest }: Props) {
  const def = icons[name]
  return (
    <svg
      viewBox={def.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={def.stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      data-icon={name}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <g dangerouslySetInnerHTML={{ __html: def.svg }} />
    </svg>
  )
}
