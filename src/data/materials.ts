export type MaterialCategory = 'plaster' | 'concrete' | 'adhesive' | 'screed';

export interface BrandInfo {
    id: string;
    name: string;
    consumptionPerMm: number; // kg per 1m2 for 1mm thickness
    bagWeight: number; // kg
}

export interface MaterialInfo {
    id: MaterialCategory;
    name: string;
    iconType: 'wall' | 'floor' | 'tile';
    brands: BrandInfo[];
}

export const materialData: MaterialInfo[] = [
    {
        id: 'plaster',
        name: 'Штукатурка',
        iconType: 'wall',
        brands: [
            { id: 'knauf_rotband', name: 'Knauf Rotband', consumptionPerMm: 0.85, bagWeight: 30 },
            { id: 'volma_sloy', name: 'Волма Слой', consumptionPerMm: 0.85, bagWeight: 30 },
            { id: 'knauf_mp75', name: 'Knauf MP75', consumptionPerMm: 1.0, bagWeight: 30 },
        ]
    },
    {
        id: 'concrete',
        name: 'Пескобетон',
        iconType: 'floor',
        brands: [
            { id: 'm300_general', name: 'М300 (Универсальный)', consumptionPerMm: 2.0, bagWeight: 40 },
            { id: 'm300_rusean', name: 'Русеан М-300', consumptionPerMm: 2.0, bagWeight: 40 }
        ]
    },
    {
        id: 'adhesive',
        name: 'Плиточный клей',
        iconType: 'tile',
        brands: [
            { id: 'ceresit_cm11', name: 'Ceresit CM 11', consumptionPerMm: 1.5, bagWeight: 25 },
            { id: 'ceresit_cm16', name: 'Ceresit CM 16', consumptionPerMm: 1.6, bagWeight: 25 },
            { id: 'knauf_fliesen', name: 'Knauf Fliesen', consumptionPerMm: 1.4, bagWeight: 25 }
        ]
    },
    {
        id: 'screed',
        name: 'Наливной пол',
        iconType: 'floor',
        brands: [
            { id: 'vetonit_3000', name: 'Vetonit 3000', consumptionPerMm: 1.5, bagWeight: 20 },
            { id: 'volma_nivelir', name: 'Волма Нивелир Экспресс', consumptionPerMm: 1.3, bagWeight: 20 },
            { id: 'osnovit_fc44m', name: 'Основит FC44 M', consumptionPerMm: 1.6, bagWeight: 20 }
        ]
    }
];
