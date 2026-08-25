import { Check } from 'lucide-react';

export default function PlanCard({
  variant = 'free',
  name,
  price,
  priceSuffix,
  badge,
  highlights = [],
  children,
}) {
  const isPro = variant === 'pro';

  if (isPro) {
    return (
      <div className="relative bg-stone-900 text-white rounded-2xl border-2 border-amber-500/50 p-6 sm:p-8 shadow-lg">
        {badge && (
          <span className="absolute -top-3 left-6 px-3 py-1 bg-amber-500 text-stone-900 text-xs font-semibold uppercase tracking-wide rounded-full">
            {badge}
          </span>
        )}
        <h2
          className="text-lg font-semibold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {name}
        </h2>
        <p
          className="mt-3 text-3xl sm:text-4xl font-bold text-amber-400"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {price}
        </p>
        {highlights.length > 0 && (
          <ul className="mt-4 space-y-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-stone-300">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6">{children}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
      <h2
        className="text-lg font-semibold text-stone-900"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {name}
      </h2>
      <p
        className="mt-3 text-3xl sm:text-4xl font-bold text-stone-900"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {price}
        {priceSuffix && (
          <span className="text-base sm:text-lg font-normal text-stone-500">{priceSuffix}</span>
        )}
      </p>
      {highlights.length > 0 && (
        <ul className="mt-4 space-y-2">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}
