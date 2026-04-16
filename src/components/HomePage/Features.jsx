import {
    BookmarkPlus,
    Search,
    Shield,
    Zap,
    Tags,
    Share2
} from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: BookmarkPlus,
            title: "Save links in seconds",
            description: "Paste a URL, add a title and tags. Your resource is saved instantly with no complex setup needed.",
            accentColor: "bg-slate-500/10",
            iconColor: "text-slate-600"
        },
        {
            icon: Search,
            title: "Find anything instantly",
            description: "Search across titles, descriptions, and tags. No more scrolling through endless chat history.",
            accentColor: "bg-amber-500/10",
            iconColor: "text-amber-600"
        },
        {
            icon: Shield,
            title: "Private by default",
            description: "Your resources are private unless you choose to share. Full control over who sees what.",
            accentColor: "bg-violet-500/10",
            iconColor: "text-violet-600"
        },
        {
            icon: Tags,
            title: "Organize with tags",
            description: "Create custom tags to categorize resources your way. Filter by multiple tags at once.",
            accentColor: "bg-rose-500/10",
            iconColor: "text-rose-600"
        },
        {
            icon: Share2,
            title: "Share with the community",
            description: "Make resources public to help others. Discover what the community has shared.",
            accentColor: "bg-sky-500/10",
            iconColor: "text-sky-600"
        },
        {
            icon: Zap,
            title: "Always accessible",
            description: "Access your resources from any device. Your links are synced and available everywhere.",
            accentColor: "bg-emerald-500/10",
            iconColor: "text-emerald-600"
        }
    ];

    return (
        <section className="py-20 sm:py-28 relative">
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-stone-50" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <span className="inline-block text-sm font-medium text-amber-600 mb-4 tracking-wide uppercase">
                        Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4 text-balance" style={{ fontFamily: 'var(--font-display)' }}>
                        Simple tools for serious organization
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed">
                        Everything you need to collect, organize, and find your resources. Nothing you don't.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <article
                                key={index}
                                className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-stone-100 hover:border-stone-200 transition-all duration-300 hover:shadow-lg"
                            >
                                {/* Icon Container */}
                                <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.accentColor} rounded-xl mb-5`}>
                                    <IconComponent className={`w-6 h-6 ${feature.iconColor}`} />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-semibold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                                    {feature.title}
                                </h3>
                                <p className="text-stone-600 leading-relaxed text-[0.9375rem]">
                                    {feature.description}
                                </p>

                                {/* Hover accent line */}
                                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-slate-500 to-slate-300 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
