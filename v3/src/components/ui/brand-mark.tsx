export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      width="108"
      height="28"
      viewBox="0 0 108 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bapita"
      className={className}
    >
      {/* Five-dot constellation mark */}
      <circle cx="6" cy="14" r="3" fill="#d4622a" />
      <circle cx="13" cy="7" r="2.5" fill="#e8920a" />
      <circle cx="13" cy="21" r="2.5" fill="#3c7a52" />
      <circle cx="20" cy="10" r="2" fill="#1a7a7a" />
      <circle cx="20" cy="18" r="2" fill="#5b5f97" />
      {/* Connecting lines */}
      <line x1="6" y1="14" x2="13" y2="7" stroke="#1e1a14" strokeOpacity="0.15" strokeWidth="1" />
      <line x1="6" y1="14" x2="13" y2="21" stroke="#1e1a14" strokeOpacity="0.15" strokeWidth="1" />
      <line x1="13" y1="7" x2="20" y2="10" stroke="#1e1a14" strokeOpacity="0.15" strokeWidth="1" />
      <line x1="13" y1="21" x2="20" y2="18" stroke="#1e1a14" strokeOpacity="0.15" strokeWidth="1" />
      {/* Wordmark */}
      <text
        x="28"
        y="19"
        fontFamily="Heebo, ui-sans-serif, system-ui, sans-serif"
        fontSize="17"
        fontWeight="800"
        fill="#1e1a14"
        letterSpacing="-0.03em"
      >
        bapita
      </text>
    </svg>
  );
}
