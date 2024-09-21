import { useState } from "react";
import { TouchableOpacity, Text, Platform, ToastAndroid, View } from "react-native";
import { TextInput } from "react-native-paper";
import { storage } from "../../../Storage";
import Label from "../../../components/Label";
import DateTimeInput from "../../../components/form/DateTimeInput";

export default function SectorCreateForm({ hideModal = () => {}, navigation = () => {} }) {
    const [name, setName] = useState("");
    const [maxNumberEmployees, setMaxNumberEmployees] = useState(1);
    const [restStartTime, setRestStartTime] = useState(new Date());
    const [breakStartTime, setBreakStartTime] = useState(new Date());

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
            {/* Nome */}
            <View>
                <Label label="Nome do setor" />
                <TextInput
                    value={name}
                    onChangeText={setName}
                    style={{ backgroundColor: "#3a3a40", height: 50 }}
                    textColor={"#e5e7eb"}
                    // underlineColor={nameValidationError.hasError ? "red" : "#38bdf8"}
                    // activeUnderlineColor={nameValidationError.hasError ? "red" : "#0369a1"}
                />
            </View>

            {/* Número máximo de funcionários */}
            <View className="mt-4">
                <Label label="Qtd. máx. funcionários" />
                <TextInput
                    value={maxNumberEmployees}
                    onChangeText={(value) => setMaxNumberEmployees(value.replace(/[^0-9]/g, ""))}
                    keyboardType="numeric"
                    style={{ backgroundColor: "#3a3a40", marginBottom: 20, height: 50 }}
                />
            </View>

            {/* Horário de inicio do descanso */}
            <View className="mb-4">
                <Label label="Horário início descanso" />
                <DateTimeInput date={restStartTime} mode="time" setDate={setRestStartTime} />
            </View>

            {/* Horário de inicio do intervalo */}
            <View className="mb-4">
                <Label label="Horário início pausa" />
                <DateTimeInput date={breakStartTime} mode="time" setDate={setBreakStartTime} />
            </View>

            {/* Botão de salvar */}
            <TouchableOpacity
                activeOpacity={0.78}
                className="mt-7 w-full bg-primary-600 h-12 rounded-3xl flex justify-center items-center"
                onPress={createSector}
            >
                <Text className="text-gray-200 text-center text-lg">Adicionar</Text>
            </TouchableOpacity>

            {/* Botão de voltar */}
            <TouchableOpacity
                activeOpacity={0.78}
                className="mt-3 w-full bg-transparent h-12 rounded-3xl flex justify-center items-center"
                onPress={hideModal}
            >
                <Text className="text-gray-200 text-center text-lg">Voltar</Text>
            </TouchableOpacity>
        </>
    );
}
