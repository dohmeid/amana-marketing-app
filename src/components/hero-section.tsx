interface HeroSectionProps {
    title: string;
}

export function HeroSection({ title }: HeroSectionProps) {
    return (
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-8 sm:py-12">
            <div className="px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                    {title}
                </h1>
            </div>
        </section>
    );
}

