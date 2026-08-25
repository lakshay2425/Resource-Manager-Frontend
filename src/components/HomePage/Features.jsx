import {
    BookmarkPlus,
    FolderOpen,
    Tags,
    Search,
    Share2,
    Image,
} from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: BookmarkPlus,
            title: "Save resources in seconds",
            description: "Paste a URL, add the necessary details, and save the resource to ResourceHub without unnecessary setup.",
            accentColor: "bg-slate-500/10",
            iconColor: "text-slate-600"
        },
        {
            icon: FolderOpen,
            title: "Organize with collections",
            description: "Group related resources into collections so everything for a topic, project, or purpose stays together.",
            accentColor: "bg-indigo-500/10",
            iconColor: "text-indigo-600"
        },
        {
            icon: Tags,
            title: "Organize with tags",
            description: "Add custom tags to categorize resources and make them easier to filter and find.",
            accentColor: "bg-rose-500/10",
            iconColor: "text-rose-600"
        },
        {
            icon: Search,
            title: "Find anything instantly",
            description: "Search across your saved resources using titles, descriptions, and tags instead of digging through old chats or bookmarks.",
            accentColor: "bg-amber-500/10",
            iconColor: "text-amber-600"
        },
        {
            icon: Share2,
            title: "Share with the community",
            description: "Make individual resources or collections public when you want to share them with others.",
            accentColor: "bg-sky-500/10",
            iconColor: "text-sky-600"
        },
        {
            icon: Image,
            title: "Dynamic sharing previews",
            description: "Public collections generate rich, dynamic previews when shared, making ResourceHub links more useful and recognizable across platforms.",
            accentColor: "bg-emerald-500/10",
            iconColor: "text-emerald-600"
        }
    ];

    return (
        <section className="py-20 sm:py-28 relative">
            <div className="absolute inset-0 bg-stone-50" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="max-w-2xl mx-auto text-center mb-16">
                    <span className="inline-block text-sm font-medium text-amber-600 mb-4 tracking-wide uppercase">
                        Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4 text-balance" style={{ fontFamily: 'var(--font-display)' }}>
                        Built for the full lifecycle of your resources
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed">
                        Capture, organize, find, and share — everything you need to stop losing useful resources across different places.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <article
                                key={index}
                                className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-stone-100 hover:border-stone-200 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.accentColor} rounded-xl mb-5`}>
                                    <IconComponent className={`w-6 h-6 ${feature.iconColor}`} />
                                </div>

                                <h3 className="text-lg font-semibold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                                    {feature.title}
                                </h3>
                                <p className="text-stone-600 leading-relaxed text-[0.9375rem]">
                                    {feature.description}
                                </p>

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
