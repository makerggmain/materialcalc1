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

    // Price State
    const [pricePerBag, setPricePerBag] = useState<number | null>(null);
    const [isFetchingPrice, setIsFetchingPrice] = useState<boolean>(false);

    // State specific to tile adhesive
    const [tileSize, setTileSize] = useState<number>(30); // cm

    // Update brand list when category changes
    useEffect(() => {
        const catData = materialData.find(c => c.id === category);
        if (catData && catData.brands.length > 0) {
            setBrand(catData.brands[0].id);
        }
        // Reset specific states
        if (category !== 'adhesive') {
            setThickness(10);
        } else {
            setThickness(4); // Default thin layer for tile
        }
    }, [category]);

    // Calculate totals
    useEffect(() => {
        const catData = materialData.find(c => c.id === category);
        if (!catData) return;

        const brandData = catData.brands.find(b => b.id === brand);
        if (!brandData) return;

        setSelectedBrandInfo(brandData);

        let baseKg = 0;

        if (category === 'adhesive') {
            // Tile adhesive consumption strongly depends on tile size which dictates trowel notch size
            // Approximate thickness based on tile size if not overridden drastically:
            // 10x10cm -> 3mm notch (~2kg), 30x30cm -> 6-8mm notch (~3-4kg), >60x60 -> 10-12mm notch (~5-6kg)
            let effectiveThickness = thickness;
            if (tileSize <= 10) effectiveThickness = 2;
            else if (tileSize <= 30) effectiveThickness = 4;
            else if (tileSize <= 60) effectiveThickness = 6;
            else effectiveThickness = 8;

            // Allow manual override if user explicitly changes thickness, but default to intelligent guess
            if (thickness !== 4) effectiveThickness = thickness; // '4' is our default init state

            baseKg = area * effectiveThickness * brandData.consumptionPerMm;
        } else {
            // Standard formula for Plaster, Screed, Concrete
            baseKg = area * thickness * brandData.consumptionPerMm;
        }

        const finalKg = baseKg * (1 + margin / 100);
        const bags = Math.ceil(finalKg / brandData.bagWeight);

        setTotalKg(Math.round(finalKg * 10) / 10); // round to 1 decimal
        setTotalBags(bags);
    }, [category, brand, area, thickness, margin, tileSize]);

    // Fetch price when brand changes
    useEffect(() => {
        const fetchPrice = async () => {
            if (!selectedBrandInfo) return;

            setIsFetchingPrice(true);
            setPricePerBag(null);

            try {
                // Ensure the brand name is safely encoded for the URL query
                const res = await fetch(`/api/price?brandName=${encodeURIComponent(selectedBrandInfo.name)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.price) {
                        setPricePerBag(data.price);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch price", err);
            } finally {
                setIsFetchingPrice(false);
            }
        };

        fetchPrice();
    }, [selectedBrandInfo]);


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >

            {/* Category Selection */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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

            <div className="p-6 space-y-6 border bg-black/20 rounded-3xl border-white/5">
                {/* Brand Dropdown */}
                <div className="space-y-2">
                    <label className="pl-1 text-sm font-medium text-zinc-400">Производитель / Смесь</label>
                    <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-4 py-3 transition-colors border rounded-xl bg-zinc-900 border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                    >
                        {materialData.find(c => c.id === category)?.brands.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Area Input */}
                    <div className="relative space-y-2">
                        <label className="flex items-center gap-2 pl-1 text-sm font-medium text-zinc-400">
                            <Layers className="w-4 h-4" />
                            {category === 'plaster' ? 'Площадь стен (м²)' : 'Площадь пола (м²)'}
                        </label>
                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={area}
                            onChange={(e) => setArea(Number(e.target.value) || 0)}
                            className="w-full px-4 py-3 transition-all border rounded-xl bg-zinc-900 border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                    </div>

                    {/* Thickness or Tile Size Input */}
                    {category === 'adhesive' ? (
                        <div className="relative space-y-2">
                            <label className="flex items-center gap-2 pl-1 text-sm font-medium text-zinc-400">
                                <Ruler className="w-4 h-4" /> Размер плитки (см)
                            </label>
                            <select
                                value={tileSize}
                                onChange={(e) => setTileSize(Number(e.target.value))}
                                className="w-full px-4 py-3 transition-all border rounded-xl bg-zinc-900 border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <option value={10}>Мелкая (до 10x10)</option>
                                <option value={30}>Средняя (до 30x30)</option>
                                <option value={60}>Крупная (до 60x60)</option>
                                <option value={100}>Макси (от 60x60)</option>
                            </select>
                            <p className="px-1 text-xs text-zinc-500">Определяет размер шпателя и толщину слоя.</p>
                        </div>
                    ) : (
                        <div className="relative space-y-2">
                            <label className="flex items-center gap-2 pl-1 text-sm font-medium text-zinc-400">
                                <Ruler className="w-4 h-4" /> Средняя толщина слоя (мм)
                            </label>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={thickness}
                                onChange={(e) => setThickness(Number(e.target.value) || 0)}
                                className="w-full px-4 py-3 transition-all border rounded-xl bg-zinc-900 border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                    )}
                </div>

                {/* Margin Slider */}
                <div className="pt-2 space-y-4">
                    <div className="flex items-end justify-between">
                        <label className="flex items-center gap-2 pl-1 text-sm font-medium text-zinc-400">
                            <Settings className="w-4 h-4" /> Запас материала
                        </label>
                        <span className="px-3 py-1 text-sm font-bold rounded-lg text-indigo-400 bg-indigo-500/10">
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
                    <div className="flex justify-between px-1 text-xs text-zinc-600">
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
                        <span className="text-sm font-semibold tracking-wider uppercase text-indigo-400/80">
                            {selectedBrandInfo ? `Мешков по ${selectedBrandInfo.bagWeight} кг` : 'Мешков'}
                        </span>
                    </div>
                </div>

                {/* Total Cost Output */}
                <div className="flex flex-col items-center justify-center p-4 mt-4 text-center border shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] bg-emerald-500/10 rounded-2xl sm:p-6 border-emerald-500/20">
                    <span className="mb-2 text-sm font-semibold tracking-wider uppercase text-emerald-500/80">Примерная стоимость</span>
                    {isFetchingPrice ? (
                        <div className="flex flex-col items-center space-y-2 animate-pulse">
                            <div className="h-8 rounded w-36 bg-emerald-500/20"></div>
                            <div className="h-4 w-52 bg-emerald-500/20 rounded"></div>
                        </div>
                    ) : pricePerBag ? (
                        <>
                            <span className="text-3xl font-black text-transparent sm:text-4xl bg-clip-text bg-gradient-to-br from-emerald-300 to-teal-300">
                                {new Intl.NumberFormat('ru-RU').format(totalBags * pricePerBag)} ₽
                            </span>
                            <span className="mt-1 text-sm font-medium text-emerald-400/80">
                                Найдена цена: {new Intl.NumberFormat('ru-RU').format(pricePerBag)} ₽/шт
                            </span>
                        </>
                    ) : (
                        <span className="text-sm italic text-zinc-500">Узнаем цену в магазине...</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
