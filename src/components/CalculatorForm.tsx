import React, { useState, useEffect } from 'react';
import { Ruler, Layers, Settings, Package, Weight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MaterialCategory, BrandInfo } from '../data/materials';
import { materialData } from '../data/materials';

export const CalculatorForm: React.FC = () => {
    const [category, setCategory] = useState<MaterialCategory>('plaster');
    const [brand, setBrand] = useState<string>(materialData[0].brands[0].id);
    const [area, setArea] = useState<number>(10);
    const [thickness, setThickness] = useState<number>(10);
    const [margin, setMargin] = useState<number>(10);

    const [totalKg, setTotalKg] = useState<number>(0);
    const [totalBags, setTotalBags] = useState<number>(0);
    const [selectedBrandInfo, setSelectedBrandInfo] = useState<BrandInfo | null>(null);

    // Update brand list when category changes
    useEffect(() => {
        const catData = materialData.find(c => c.id === category);
        if (catData && catData.brands.length > 0) {
            setBrand(catData.brands[0].id);
        }
    }, [category]);

    // Calculate totals
    useEffect(() => {
        const catData = materialData.find(c => c.id === category);
        if (!catData) return;

        const brandData = catData.brands.find(b => b.id === brand);
        if (!brandData) return;

        setSelectedBrandInfo(brandData);

        // Formula: Area * Thickness * ConsumptionRate * (1 + Margin/100)
        const baseKg = area * thickness * brandData.consumptionPerMm;
        const finalKg = baseKg * (1 + margin / 100);
        const bags = Math.ceil(finalKg / brandData.bagWeight);

        setTotalKg(Math.round(finalKg * 10) / 10); // round to 1 decimal
        setTotalBags(bags);
    }, [category, brand, area, thickness, margin]);


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >

            {/* Category Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {materialData.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 border
              ${category === cat.id
                                ? 'bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] text-indigo-300'
                                : 'glass hover:bg-white/10 border-white/5 text-zinc-400'}`}
                    >
                        <span className="text-sm font-medium">{cat.name}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-6 bg-black/20 p-6 rounded-3xl border border-white/5">
                {/* Brand Dropdown */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 pl-1">Производитель / Смесь</label>
                    <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
                    >
                        {materialData.find(c => c.id === category)?.brands.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Area Input */}
                    <div className="space-y-2 relative">
                        <label className="text-sm font-medium text-zinc-400 pl-1 flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Площадь (м²)
                        </label>
                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={area}
                            onChange={(e) => setArea(Number(e.target.value) || 0)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>

                    {/* Thickness Input */}
                    <div className="space-y-2 relative">
                        <label className="text-sm font-medium text-zinc-400 pl-1 flex items-center gap-2">
                            <Ruler className="w-4 h-4" /> Толщина слоя (мм)
                        </label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={thickness}
                            onChange={(e) => setThickness(Number(e.target.value) || 0)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Margin Slider */}
                <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-medium text-zinc-400 pl-1 flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Запас материала
                        </label>
                        <span className="text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-lg text-sm">
                            {margin}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        step="5"
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-xs text-zinc-600 px-1">
                        <span>0% (Без запаса)</span>
                        <span>10% (Рекомендуемо)</span>
                        <span>20% (Сложный рельеф)</span>
                    </div>
                </div>
            </div>

            {/* Results Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 mt-8 border-indigo-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl transition-all group-hover:bg-indigo-500/20"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl transition-all group-hover:bg-cyan-500/20"></div>

                <h3 className="text-lg font-medium text-zinc-400 mb-6 relative z-10">Итого нужно заказать:</h3>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/5 flex flex-col items-center justify-center text-center">
                        <Weight className="w-8 h-8 text-zinc-500 mb-3" />
                        <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-500">
                            {totalKg}
                        </span>
                        <span className="text-sm text-zinc-500 mt-1 uppercase tracking-wider font-semibold">Килограмм</span>
                    </div>

                    <div className="bg-indigo-500/10 rounded-2xl p-4 sm:p-6 border border-indigo-500/20 flex flex-col items-center justify-center text-center shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]">
                        <Package className="w-8 h-8 text-indigo-400 mb-3" />
                        <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-cyan-300">
                            {totalBags}
                        </span>
                        <span className="text-sm text-indigo-400/80 mt-1 uppercase tracking-wider font-semibold">
                            {selectedBrandInfo ? `Мешков по ${selectedBrandInfo.bagWeight} кг` : 'Мешков'}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
