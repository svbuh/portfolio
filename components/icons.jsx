// Shared icon set
const Icon = {
  backend: (
    <svg viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="22" height="7" rx="1.5" />
      <rect x="5" y="14" width="22" height="7" rx="1.5" />
      <rect x="5" y="23" width="22" height="5" rx="1.5" />
      <circle cx="9" cy="8.5" r="0.6" fill="currentColor" />
      <circle cx="9" cy="17.5" r="0.6" fill="currentColor" />
      <circle cx="9" cy="25.5" r="0.6" fill="currentColor" />
    </svg>
  ),
  frontend: (
    <svg viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="24" height="20" rx="1.5" />
      <path d="M4 12h24" />
      <circle cx="7.5" cy="9" r="0.6" fill="currentColor" />
      <circle cx="10.5" cy="9" r="0.6" fill="currentColor" />
      <path d="M11 18l-2 2 2 2 M21 18l2 2-2 2 M17 17l-2 6" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 22a5 5 0 010-10 7 7 0 0113.5 2A4.5 4.5 0 0123 22z" />
      <path d="M13 26v-3 M19 26v-3 M16 28v-5" />
    </svg>
  ),
  arch: (
    <svg viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="7" r="3" />
      <circle cx="7" cy="24" r="3" />
      <circle cx="25" cy="24" r="3" />
      <circle cx="16" cy="18" r="3" />
      <path d="M16 10v5 M14 20l-5 2 M18 20l5 2" />
    </svg>
  ),
};

window.Icon = Icon;
