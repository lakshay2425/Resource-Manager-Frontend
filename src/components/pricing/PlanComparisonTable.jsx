import { Check, X } from 'lucide-react';
import { PLAN_COMPARISON_ROWS } from '../../constants/planFeatures.js';

function BoolCell({ value, isPro = false }) {
  if (value) {
    return (
      <Check
        className={`w-5 h-5 mx-auto ${isPro ? 'text-amber-500' : 'text-emerald-600'}`}
        aria-label="Included"
      />
    );
  }
  return <X className="w-5 h-5 mx-auto text-stone-400" aria-label="Not included" />;
}

export default function PlanComparisonTable({ title = 'Compare plans', className = '' }) {
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <h2
        className="text-xl sm:text-2xl font-bold text-stone-900 mb-6"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto sm:overflow-visible">
          <table className="w-full table-fixed text-sm min-w-[320px]">
            <colgroup>
              <col className="w-[50%]" />
              <col className="w-[25%]" />
              <col className="w-[25%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <th className="pl-4 sm:pl-6 pr-3 py-3 text-left font-semibold text-stone-900">
                  Feature
                </th>
                <th className="px-3 py-3 text-center font-semibold text-stone-900">
                  Free
                </th>
                <th className="pl-3 pr-4 sm:pr-6 py-3 text-center font-semibold text-amber-600 bg-amber-50/50">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {PLAN_COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-stone-100 last:border-0">
                  <td className="pl-4 sm:pl-6 pr-3 py-3 text-stone-700">{row.feature}</td>
                  <td className="px-3 py-3 text-center text-stone-600">
                    {row.type === 'bool' ? <BoolCell value={row.free} /> : row.free}
                  </td>
                  <td className="pl-3 pr-4 sm:pr-6 py-3 text-center text-stone-600 bg-amber-50/30">
                    {row.type === 'bool' ? <BoolCell value={row.pro} isPro /> : row.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
