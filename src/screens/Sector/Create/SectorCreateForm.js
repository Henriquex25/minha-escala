import { useState } from "react";
import { TouchableOpacity, Text, Platform, ToastAndroid } from "react-native";
import { TextInput } from "react-native-paper";
import { storage } from "../../../Storage";
import Label from "../../../components/Label";

export default function SectorCreateForm({ hideModal = () => {}, navigation = () => {} }) {
    const [name, setName] = useState("");

    function createSector() {
        const existingSectors = storage.getString("sectors");
        let sectors = existingSectors ? JSON.parse(existingSectors) : [];
        const lastItem = sectors.slice(-1);
        const lastId = lastItem.length > 0 ? lastItem[0].id : 0;

        sectors.push({
            id: lastId + 1,
            name: name,
        });

        storage.set("sectors", JSON.stringify(sectors));

        if (Platform.OS === "android") {
            ToastAndroid.show("Setor Criado com sucesso ✓", ToastAndroid.SHORT);
        }

        hideModal();
    }

    return (
        <>
            <Label label="Nome" />
            <TextInput label="Nome" value={name} onChangeText={setName} style={{ backgroundColor: "#3a3a40", marginBottom: 20 }} />

            {/* Botão de voltar */}
            <TouchableOpacity
                activeOpacity={0.78}
                className="mt-7 w-full bg-gray-600 h-12 rounded-3xl flex justify-center items-center"
                onPress={hideModal}
            >
                <Text className="text-gray-200 text-center text-lg">Voltar</Text>
            </TouchableOpacity>

            {/* Botão de salvar */}
            <TouchableOpacity
                activeOpacity={0.78}
                className="mt-3 w-full bg-primary-600 h-12 rounded-3xl flex justify-center items-center"
                onPress={createSector}
            >
                <Text className="text-gray-200 text-center text-lg">Adicionar</Text>
            </TouchableOpacity>
        </>
    );
}
