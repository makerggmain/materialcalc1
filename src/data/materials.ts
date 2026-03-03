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
            { id: 'knauf_rotband_30', name: 'KNAUF Штукатурка гипсовая Ротбанд', consumptionPerMm: 0.85, bagWeight: 30 },
            { id: 'knauf_rotband_10', name: 'KNAUF Штукатурка гипсовая Ротбанд', consumptionPerMm: 0.85, bagWeight: 10 },
            { id: 'knauf_rotband_5', name: 'KNAUF Штукатурка гипсовая Ротбанд', consumptionPerMm: 0.85, bagWeight: 5 },
            { id: 'knauf_goldband_30', name: 'KNAUF Штукатурка гипсовая Гольдбанд', consumptionPerMm: 0.85, bagWeight: 30 },
            { id: 'knauf_mp75_30', name: 'Штукатурка механизированная гипсовая Knauf МП 75', consumptionPerMm: 1.0, bagWeight: 30 },
            { id: 'knauf_unterputz_25', name: 'KNAUF УНТЕРПУЦ штукатурка цементная', consumptionPerMm: 1.7, bagWeight: 25 },
            { id: 'volma_sloy_30', name: 'ВОЛМА СЛОЙ Штукатурка гипсовая', consumptionPerMm: 0.85, bagWeight: 30 },
            { id: 'volma_gips_activ_30', name: 'ВОЛМА ГИПС-АКТИВ ЭКСТРА', consumptionPerMm: 0.9, bagWeight: 30 },
            { id: 'volma_holst_30', name: 'ВОЛМА ХОЛСТ Штукатурка гипсовая', consumptionPerMm: 0.9, bagWeight: 30 },
            { id: 'unis_teplon_30', name: 'UNIS ТЕПЛОН штукатурка гипсовая', consumptionPerMm: 0.85, bagWeight: 30 },
            { id: 'unis_teplon_5', name: 'UNIS ТЕПЛОН штукатурка гипсовая', consumptionPerMm: 0.85, bagWeight: 5 },
            { id: 'unis_silin_25', name: 'UNIS СИЛИН штукатурка цементная', consumptionPerMm: 1.6, bagWeight: 25 },
            { id: 'starateli_gips_30', name: 'СТАРАТЕЛИ Штукатурка гипсовая', consumptionPerMm: 0.9, bagWeight: 30 },
            { id: 'starateli_gips_5', name: 'СТАРАТЕЛИ Штукатурка гипсовая', consumptionPerMm: 0.9, bagWeight: 5 },
            { id: 'rusean_plaster_30', name: 'РУСЕАН ПЛАСТЕР Штукатурка гипсовая', consumptionPerMm: 0.9, bagWeight: 30 },
            { id: 'rusean_cement_40', name: 'РУСЕАН штукатурка цементная М150', consumptionPerMm: 1.7, bagWeight: 40 },
            { id: 'rusean_termoplast_30', name: 'Штукатурка гипсовая Русеан Termoplast-M белая', consumptionPerMm: 0.9, bagWeight: 30 },
            { id: 'vetonit_tt40_25', name: 'ВЕТОНИТ ТТ40 цементная штукатурка', consumptionPerMm: 1.7, bagWeight: 25 },
            { id: 'knauf_diamant_25', name: 'Штукатурка декоративная Knauf Диамант короед 1,5мм', consumptionPerMm: 1.5, bagWeight: 25 },
            { id: 'ceresit_ct64_25', name: 'Штукатурка декоративная акриловая Церезит CT 64 короед', consumptionPerMm: 2.7, bagWeight: 25 },
            { id: 'ceresit_ct174_25', name: 'Штукатурка камешковая готовая CERESIT СТ174', consumptionPerMm: 2.7, bagWeight: 25 }
        ]
    },
    {
        id: 'concrete',
        name: 'Пескобетон',
        iconType: 'floor',
        brands: [
            { id: 'peskobeton_anker_40', name: 'Пескобетон АНКЕР', consumptionPerMm: 2.0, bagWeight: 40 },
            { id: 'peskobeton_rusean_40', name: 'Пескобетон РУСЕАН', consumptionPerMm: 2.0, bagWeight: 40 }
        ]
    },
    {
        id: 'adhesive',
        name: 'Плиточный клей',
        iconType: 'tile',
        brands: [
            { id: 'ceresit_cm11_25', name: 'CERESIT CM-11', consumptionPerMm: 1.5, bagWeight: 25 },
            { id: 'ceresit_cm14_25', name: 'CERESIT СМ-14', consumptionPerMm: 1.5, bagWeight: 25 },
            { id: 'ceresit_cm16_25', name: 'CERESIT СМ-16', consumptionPerMm: 1.6, bagWeight: 25 },
            { id: 'ceresit_cm17_25', name: 'CERESIT CM-17', consumptionPerMm: 1.6, bagWeight: 25 },
            { id: 'knauf_flizen_25', name: 'KNAUF FLIZEN', consumptionPerMm: 1.4, bagWeight: 25 },
            { id: 'knauf_flizen_plus_25', name: 'KNAUF FLIZEN PLUS', consumptionPerMm: 1.4, bagWeight: 25 },
            { id: 'unis_2000_25', name: 'UNIS 2000', consumptionPerMm: 1.3, bagWeight: 25 },
            { id: 'unis_2000_5', name: 'UNIS 2000', consumptionPerMm: 1.3, bagWeight: 5 },
            { id: 'unis_plus_25', name: 'UNIS PLUS', consumptionPerMm: 1.3, bagWeight: 25 },
            { id: 'unis_plus_5', name: 'UNIS PLUS', consumptionPerMm: 1.3, bagWeight: 5 },
            { id: 'unis_xxi_25', name: 'UNIS XXI', consumptionPerMm: 1.3, bagWeight: 25 },
            { id: 'unis_xxi_5', name: 'UNIS XXI', consumptionPerMm: 1.3, bagWeight: 5 },
            { id: 'litokol_k17_25', name: 'Литокол К17', consumptionPerMm: 1.5, bagWeight: 25 },
            { id: 'litokol_k55_25', name: 'Литокол К55', consumptionPerMm: 1.5, bagWeight: 25 },
            { id: 'litokol_k77_25', name: 'Литокол К77', consumptionPerMm: 1.5, bagWeight: 25 },
            { id: 'litokol_k80_25', name: 'Литокол К80', consumptionPerMm: 1.5, bagWeight: 25 },
            { id: 'litokol_x11_25', name: 'Литокол Х11', consumptionPerMm: 1.5, bagWeight: 25 }
        ]
    },
    {
        id: 'screed',
        name: 'Наливной пол',
        iconType: 'floor',
        brands: [
            { id: 'vetonit_3000_20', name: 'ВЕТОНИТ 3000', consumptionPerMm: 1.5, bagWeight: 20 },
            { id: 'vetonit_3100_20', name: 'ВЕТОНИТ 3100', consumptionPerMm: 1.5, bagWeight: 20 },
            { id: 'vetonit_4000_20', name: 'ВЕТОНИТ 4000', consumptionPerMm: 1.5, bagWeight: 20 },
            { id: 'vetonit_4100_20', name: 'ВЕТОНИТ 4100', consumptionPerMm: 1.5, bagWeight: 20 },
            { id: 'vetonit_6000_25', name: 'ВЕТОНИТ 6000 цементный', consumptionPerMm: 1.8, bagWeight: 25 },
            { id: 'volma_nivelir_20', name: 'ВОЛМА Нивелир', consumptionPerMm: 1.3, bagWeight: 20 },
            { id: 'unis_gorizont_20', name: 'UNIS Горизонт', consumptionPerMm: 1.5, bagWeight: 20 },
            { id: 'litokol_s50_20', name: 'Литокол S50', consumptionPerMm: 1.6, bagWeight: 20 },
            { id: 'ceresit_cn175_20', name: 'Наливной пол ЦЕРЕЗИТ CN175', consumptionPerMm: 1.6, bagWeight: 20 },
            { id: 'starateli_naliv_25', name: 'СТАРАТЕЛИ Гипсово-Цементный', consumptionPerMm: 1.5, bagWeight: 25 }
        ]
    }
];
