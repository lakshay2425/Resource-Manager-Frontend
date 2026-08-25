import { MessageSquare, Bookmark, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useGoogleAuth } from "../../hooks/useGoogleOAuth.js";

const WhyRH = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const { handleGoogleLogin } = useGoogleAuth();

    const problems = [
        {
            icon: MessageSquare,
            title: "Useful links get buried in chat",
            description: "A great resource shared in WhatsApp or Slack disappears between memes, updates, and everyday messages."
        },
        {
            icon: Bookmark,
            title: "Bookmarks become a mess",
            description: "Browser bookmarks start organized, then turn into hundreds of unsorted links that are hard to search through."
        },
        {
            icon: FileText,
            title: "Saves spread across tools",
            description: "Notes apps and email drafts hold resources too — so nothing lives in one searchable place."
        }
    ];

    const benefits = [
        "Capture resources quickly",
        "Organize into collections",
        "Tag for flexible filtering",
        "Search across your library",
        "Share resources or collections publicly when you want",
    ];

    return (
        <section className="py-20 sm:py-28 relative overflow-hidden">
            <div className="absolute inset-0 bg-stone-900" />
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-slate-800/20 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    <div>
                        <span className="inline-block text-sm font-medium text-amber-400 mb-4 tracking-wide uppercase">
                            The Problem
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                            Your best resources are scattered across a dozen apps
                        </h2>
                        <p className="text-stone-400 text-lg mb-10 leading-relaxed">
                            People save useful resources across WhatsApp, Slack, browser bookmarks, notes apps,
                            email drafts, and other scattered places. When you need them later, finding them is difficult.
                        </p>

                        <div className="space-y-6">
                            {problems.map((problem, index) => {
                                const IconComponent = problem.icon;
                                return (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center">
                                            <IconComponent className="w-5 h-5 text-stone-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                                                {problem.title}
                                            </h3>
                                            <p className="text-stone-400 text-[0.9375rem] leading-relaxed">
                                                {problem.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-stone-800/50 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-stone-700/50">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-full mb-6">
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                                <span className="text-sm font-medium text-amber-400">The Solution</span>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                One place for everything that matters
                            </h3>

                            <p className="text-stone-400 mb-4 leading-relaxed">
                                ResourceHub lets you capture resources quickly, organize them into collections,
                                add tags, search across your saved resources, and decide what to share publicly.
                            </p>

                            <p className="text-stone-400 mb-8 leading-relaxed text-[0.9375rem]">
                             Link-sharing tools are built for publishing. ResourceHub is built for managing the resources you collect.
                             Capture → Organize → Find → Share.
                            </p>

                            <ul className="space-y-3 mb-8">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-center gap-3 text-stone-300">
                                        <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                        <span className="text-[0.9375rem]">{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => isAuthenticated ? navigate("/createResource") : handleGoogleLogin()}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all duration-200 group"
                            >
                                {isAuthenticated ? "Add a resource" : "Get started free"}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-slate-500/20 to-amber-500/10 rounded-full blur-2xl" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyRH;
