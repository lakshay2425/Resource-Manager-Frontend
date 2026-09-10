import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useGoogleAuth } from '../hooks/useGoogleOAuth.js';
import { usePageSeo } from '../hooks/usePageSeo.js';
import { PUBLIC_ROUTES } from '../utilis/seo.js';
import { FREE_PLAN_HIGHLIGHTS, PRO_PLAN_HIGHLIGHTS } from '../constants/planFeatures.js';
import { buildInPublicCollection } from '../utilis/navLinks.js';
import PlanCard from '../components/pricing/PlanCard.jsx';
import PlanComparisonTable from '../components/pricing/PlanComparisonTable.jsx';

export default function Pricing() {
  usePageSeo(PUBLIC_ROUTES.pricing);

  const { isAuthenticated } = useContext(AuthContext);
  const { handleGoogleLogin } = useGoogleAuth();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          <h1
            className="text-2xl sm:text-3xl font-bold text-stone-900"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Simple, transparent pricing
          </h1>
          <p className="text-stone-600 mt-1 text-sm sm:text-base">
            Start organizing your resources for free. Pro features are coming soon.
          </p>
          <p className="mt-3 text-sm sm:text-base">
            <Link
              to={buildInPublicCollection.href}
              className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              {buildInPublicCollection.pricingNote} →
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12 sm:mb-16">
          <PlanCard
            variant="free"
            name="Free"
            price="$0"
            priceSuffix=" / forever"
            highlights={FREE_PLAN_HIGHLIGHTS}
          >
            {isAuthenticated ? (
              <button
                type="button"
                disabled
                className="w-full px-5 py-3 bg-stone-100 text-stone-500 text-sm font-medium rounded-lg cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="btn-primary w-full"
              >
                Get Started
              </button>
            )}
          </PlanCard>

          <PlanCard
            variant="pro"
            name="Pro"
            price="Coming Soon"
            badge="Most Popular"
            highlights={PRO_PLAN_HIGHLIGHTS}
          >
            <Link
              to="/pricing/upgrade"
              className="block w-full px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold rounded-lg transition-colors text-center"
            >
              Upgrade
            </Link>
          </PlanCard>
        </div>

        <PlanComparisonTable />
      </div>
    </div>
  );
}
