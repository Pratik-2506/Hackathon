import React from 'react';

// --- VISUAL ASSETS (SVG) ---
// 1. Soil (The base)
const SoilSvg = () => (
    <g>
        {/* Dirt Mound - Solid Colors Only */}
        <circle cx="100" cy="160" r="40" fill="#795548" />
        <path d="M60 160 Q100 190 140 160" fill="#5D4037" />
    </g>
);

// 2. Sprout (Level 1)
const SproutSvg = () => (
    <g>
        {/* Stem */}
        <path d="M100 160 Q100 120 100 130" stroke="#8BC34A" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Leaves */}
        <path d="M100 130 Q80 120 90 140" fill="#8BC34A" />
        <path d="M100 130 Q120 120 110 140" fill="#8BC34A" />
    </g>
);

// 3. Sapling (Level 2)
const SaplingSvg = () => (
    <g>
        {/* Stem */}
        <path d="M100 160 Q100 90 100 100" stroke="#689F38" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* More Leaves */}
        <path d="M100 130 Q60 110 80 150" fill="#7CB342" />
        <path d="M100 120 Q140 100 120 140" fill="#7CB342" />
        <path d="M100 100 Q80 80 90 110" fill="#8BC34A" />
        <path d="M100 100 Q120 80 110 110" fill="#8BC34A" />
    </g>
);

// 4. Blooming (Level 3)
const FlowerSvg = () => (
    <g>
        {/* Stem */}
        <path d="M100 160 Q105 80 100 90" stroke="#558B2F" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* Leaves */}
        <path d="M100 140 Q50 120 60 160" fill="#558B2F" />
        <path d="M100 120 Q150 100 140 150" fill="#558B2F" />

        {/* Flower Head */}
        <g transform="translate(0, -10)">
            <circle cx="100" cy="90" r="20" fill="#FFEB3B" /> {/* Center */}
            {/* Petals */}
            <circle cx="100" cy="65" r="15" fill="#F48FB1" />
            <circle cx="125" cy="90" r="15" fill="#F48FB1" />
            <circle cx="100" cy="115" r="15" fill="#F48FB1" />
            <circle cx="75" cy="90" r="15" fill="#F48FB1" />
            <circle cx="118" cy="72" r="15" fill="#F06292" />
            <circle cx="118" cy="108" r="15" fill="#F06292" />
            <circle cx="82" cy="108" r="15" fill="#F06292" />
            <circle cx="82" cy="72" r="15" fill="#F06292" />
        </g>
    </g>
);

export default function Plant({ streak = 0 }) {

    // LOGIC: Select component based on streak number
    const getPlantStage = () => {
        if (streak >= 7) return { Comp: FlowerSvg, label: "Blooming Garden" };
        if (streak >= 3) return { Comp: SaplingSvg, label: "Growing Strong" };
        // Default to sprout for anything 0-2 so it's always visible
        return { Comp: SproutSvg, label: "Just Sprouted" };
    };

    const { Comp, label } = getPlantStage();

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <div className="relative w-64 h-64 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center shadow-inner">

                {/* Sun Element (Decoration) */}
                <div className="absolute top-4 right-8 w-8 h-8 rounded-full bg-yellow-300 shadow-lg shadow-yellow-200 animate-pulse"></div>

                <svg
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    <SoilSvg />
                    <Comp />
                </svg>
            </div>

            <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-slate-800">{label}</h3>
                <div className="inline-block mt-2 px-3 py-1 bg-mint-100 text-mint-700 text-xs font-bold uppercase tracking-wider rounded-full">
                    Day {streak}
                </div>
            </div>
        </div>
    );
}
