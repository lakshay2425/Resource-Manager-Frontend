import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useGoogleAuth } from '../hooks/useGoogleOAuth.js';
import { usePageSeo } from '../hooks/usePageSeo.js';
import { PUBLIC_ROUTES } from '../utilis/seo.js';
import {
  BILLING_PERIODS,
  DEFAULT_BILLING_PERIOD,
} from '../constants/billingPeriods.js';

export default function PricingUpgrade() {
  usePageSeo(PUBLIC_ROUTES.pricingUpgrade);

  const { isAuthenticated } = useContext(AuthContext);
  const { handleGoogleLogin } = useGoogleAuth();
  const [billingPeriod, setBillingPeriod] = useState(DEFAULT_BILLING_PERIOD);

  const selectedPeriod = BILLING_PERIODS.find((p) => p.id === billingPeriod);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Back to Plans
        </Link>

        <div className="mb-8 sm:mb-10">
          <h1
            className="text-2xl sm:text-3xl font-bold text-stone-900"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Choose your Pro plan
          </h1>
          <p className="text-stone-600 mt-2 text-sm sm:text-base">
            Choose how long you&apos;d like to use Pro. Payment integration is coming soon.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:gap-8 lg:items-start">
          <fieldset className="min-w-0 border-0 p-0 m-0 mb-8 lg:mb-0">
            <legend className="text-sm font-medium text-stone-700 mb-4 block">
              Choose billing period
            </legend>

            <div className="flex flex-col gap-4">
              {BILLING_PERIODS.map((period) => {
                const isSelected = billingPeriod === period.id;

                return (
                  <label
                    key={period.id}
                    className={`relative block cursor-pointer text-left rounded-xl border-2 p-4 sm:p-5 transition-colors duration-200 focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="billing-period"
                      value={period.id}
                      checked={isSelected}
                      onChange={() => setBillingPeriod(period.id)}
                      className="sr-only"
                    />
                    {period.recommended && (
                      <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-amber-500 text-stone-900 text-xs font-semibold uppercase tracking-wide rounded-full">
                        Recommended
                      </span>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500'
                            : 'border-stone-300 bg-white'
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </span>
                      <span
                        className="font-semibold text-stone-900"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {period.label}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500 pl-8">Coming Soon</p>
                    <p className="text-xs text-stone-400 pl-8 mt-0.5">{period.tagline}</p>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 sm:p-8 lg:sticky lg:top-8">
            <h2
              className="text-lg font-semibold text-stone-900 mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Your Pro plan
            </h2>

            <dl className="space-y-4 mb-6">
              <div className="flex justify-between items-baseline gap-4">
                <dt className="text-sm text-stone-500">Selected plan</dt>
                <dd className="text-sm font-medium text-stone-900">
                  Pro · {selectedPeriod?.summaryLabel}
                </dd>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <dt className="text-sm text-stone-500">Price</dt>
                <dd className="text-sm font-medium text-stone-900">Coming Soon</dd>
              </div>
            </dl>

            <button
              type="button"
              disabled
              className="w-full px-5 py-3 bg-stone-100 text-stone-500 text-sm font-medium rounded-lg cursor-not-allowed"
            >
              Upgrade — Coming Soon
            </button>

            {!isAuthenticated && (
              <p className="mt-4 text-center text-sm text-stone-600">
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  className="text-slate-700 font-medium hover:text-slate-900 underline underline-offset-2"
                >
                  Sign in
                </button>
                {' '}to be ready when billing launches.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
