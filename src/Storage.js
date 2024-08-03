import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const sectors = [
    { id: "observation", name: "Observação" },
    { id: "receptionC", name: "Recepção C" },
    { id: "receptionG", name: "Recepção G" },
    { id: "medicalSupport", name: "Apoio Médico" },
    { id: "fastCLM", name: "Fast CLM" },
    { id: "fastCollect", name: "Fast Collect" },
    { id: "fastMedication", name: "Fast Medication" },
    { id: "concierge", name: "Concierge" },
];
