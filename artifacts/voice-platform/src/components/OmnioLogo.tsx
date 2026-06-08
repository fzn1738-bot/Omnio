import { cn } from "@/lib/utils";

/**
 * Omnio brand mark: an interlocking 3D green sphere with a glowing aura.
 * `gid` namespaces the gradient ids so multiple instances can coexist on a page.
 */
export function OmnioMark({
  size = 32,
  className,
  gid = "omnio",
}: {
  size?: number;
  className?: string;
  gid?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("omnio-glow", className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${gid}-aura`} cx="50%" cy="50%" r="50%">
          <stop offset="38%" stopColor="#34f5a0" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#10b981" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gid}-core`} cx="36%" cy="32%" r="78%">
          <stop offset="0%" stopColor="#b6ffe0" />
          <stop offset="38%" stopColor="#2be89a" />
          <stop offset="78%" stopColor="#0f9d6a" />
          <stop offset="100%" stopColor="#066b48" />
        </radialGradient>
        <linearGradient id={`${gid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d6ffee" />
          <stop offset="55%" stopColor="#1ed98a" />
          <stop offset="100%" stopColor="#0a7a52" />
        </linearGradient>
      </defs>

      <circle cx="90" cy="90" r="86" fill={`url(#${gid}-aura)`} />

      <g stroke={`url(#${gid}-ring)`} strokeWidth="5" fill="none" opacity="0.55">
        <ellipse cx="90" cy="90" rx="62" ry="26" transform="rotate(-30 90 90)" />
        <ellipse cx="90" cy="90" rx="62" ry="26" transform="rotate(90 90 90)" />
      </g>

      <circle cx="90" cy="90" r="44" fill={`url(#${gid}-core)`} />
      <ellipse
        cx="74"
        cy="72"
        rx="15"
        ry="10"
        fill="#ffffff"
        opacity="0.45"
        transform="rotate(-30 74 72)"
      />

      <g stroke={`url(#${gid}-ring)`} strokeWidth="6" fill="none">
        <ellipse cx="90" cy="90" rx="62" ry="26" transform="rotate(30 90 90)" />
        <ellipse cx="90" cy="90" rx="62" ry="26" transform="rotate(-30 90 90)" opacity="0.92" />
      </g>
    </svg>
  );
}

export function OmnioWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <OmnioMark size={30} />
      <span className="text-xl font-bold tracking-tight text-foreground">Omnio</span>
    </div>
  );
}
