import { useState } from "react";
import { View, StatusBar, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import Body from "../../components/layout/Body";
import Title from "../../components/layout/Title";
import SectorCreate from "./Create/SectorCreate";

export default function SectorIndex() {
    const [showingModalCreateSector, setShowingModalCreateSector] = useState(false);

    const showModalCreateSector = () => setShowingModalCreateSector(true);
    const hideModalCreateSector = () => setShowingModalCreateSector(false);

    return (
        <Body>
            <StatusBar barStyle="light-content" backgroundColor="#2a2a2e" />

            <Title title="Setores" />

            {/* Botão abrir modal de criação */}
            <TouchableOpacity
                activeOpacity={0.78}
                className="h-12 w-12 bg-primary-500 text-gray-200 rounded-full flex justify-center items-center absolute top-3 right-5"
                onPress={showModalCreateSector}
            >
                <Icon source="plus" size={22} color="white" />
            </TouchableOpacity>

            {/* Modal de criação */}
            <SectorCreate visible={showingModalCreateSector} hideModal={hideModalCreateSector} />
        </Body>
    );
}
