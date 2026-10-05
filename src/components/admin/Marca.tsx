import React from 'react'

// Marca do painel: ALPHA PRO, assinado pela RK Studios.

export function Logo() {
  return (
    <div className="ap-logo">
      <span className="ap-logo__mark">
        ALPHA<span>PRO</span>
      </span>
      <span className="ap-logo__sub">Painel da página · por RK Studios</span>
    </div>
  )
}

export function Icone() {
  return (
    <svg className="ap-icone" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="currentColor" />
      <path
        d="M20 47 31 17h2l11 30M24.5 36h15"
        fill="none"
        stroke="var(--theme-bg, #fff)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AntesDoLogin() {
  return <p className="ap-login-nota">Entre com o e-mail e a senha que a RK Studios enviou para você.</p>
}

export function VerPagina() {
  return (
    <a className="ap-ver-pagina" href="/" target="_blank" rel="noopener noreferrer">
      Ver a página no ar ↗
    </a>
  )
}
