import { useState } from "react";
import { TouchableOpacity, View, Text, Platform, ToastAndroid, Alert } from "react-native";
import { Checkbox, TextInput } from "react-native-paper";
import { storage, allSectors } from "../../../Storage";
import Label from "../../../components/Label";
import { globalStyle } from "../../../globalStyle";
import validator from "validator";

export default function SectorCreateForm({ hideModal = () => {} }) {
    const [name, setName] = useState("");
    const [nameValidationError, setNameValidationError] = useState({
        hasError: false,
        message: "",
    });
    const [leadership, setLeadership] = useState(false);
    const [firstReference, setFirstReference] = useState(false);
    const [secondReference, setSecondReference] = useState(false);
    const [sectors, setSectors] = useState(
        allSectors.map((s) => {
            return { [s.id]: false };
        })
    );

    function saveEmployee() {
        if (!validateName()) {
            Alert.alert(
                "Erro",
                nameValidationError.message
                    ? nameValidationError.message
                    : "Preencha os campos corretamente."
            );
            return;
        }

        const existingEmployees = storage.getString("employees");
        let employees = existingEmployees ? JSON.parse(existingEmployees) : [];
        const lastItem = employees.slice(-1);
        const lastId = lastItem.length > 0 ? lastItem[0].id : 0;

        employees.push({
            id: lastId + 1,
            name: name,
            leadership: leadership,
            firstReference: firstReference,
            secondReference: secondReference,
            sectors: sectors,
        });

        storage.set("employees", JSON.stringify(employees));

        if (Platform.OS === "android") {
            ToastAndroid.show("Funcionário adicionado com sucesso ✓", ToastAndroid.SHORT);
        }

        hideModal();
    }

    function validateName() {
        if (validator.isEmpty(name)) {
            setNameValidationError({ hasError: true, message: 'O campo "Nome" é obrigatório' });
            return false;
        }

        if (name.length < 3) {
            setNameValidationError({
                hasError: true,
                message: 'O campo "Nome" deve conter pelo menos 3 caracteres.',
            });
            return false;
        }

        if (name.length > 30) {
            setNameValidationError({
                hasError: true,
                message: 'O campo "Nome" deve conter no máximo 30 caracteres.',
            });
            return false;
        }

        setNameValidationError({ hasError: false, message: "" });
        return true;
    }

    return (
        <>
            <Label label="Nome" />
            <View style={{ marginBottom: 20 }}>
                <TextInput
                    label="Nome"
                    onChangeText={setName}
                    style={{ backgroundColor: "#3a3a40", height: 50 }}
                    textColor={"#e5e7eb"}
                    underlineColor={nameValidationError.hasError ? "red" : "#38bdf8"}
                    activeUnderlineColor={nameValidationError.hasError ? "red" : "#0369a1"}
                    onBlur={validateName}
                />
                {nameValidationError.hasError && (
                    <Text className="mt-1 text-red-500">{nameValidationError.message}</Text>
                )}
            </View>

            {/* Liderança e referências */}
            <Label label="Liderança e referências" />
            <View className="flex flex-row flex-wrap mb-3">
                {/* Liderança */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={leadership ? "checked" : "unchecked"}
                        onPress={() => {
                            setLeadership(!leadership);
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Liderança"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                        onPress={() => {
                            setLeadership(!leadership);
                        }}
                    />
                </View>

                {/* Primeira referência */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={firstReference ? "checked" : "unchecked"}
                        onPress={() => {
                            setFirstReference(!firstReference);
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="1ª Referência"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                        onPress={() => {
                            setFirstReference(!firstReference);
                        }}
                    />
                </View>

                {/* Segunda referência */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={secondReference ? "checked" : "unchecked"}
                        onPress={() => {
                            setSecondReference(!secondReference);
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="2ª Referência"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                        onPress={() => {
                            setSecondReference(!secondReference);
                        }}
                    />
                </View>
            </View>

            {/* Setores */}
            <Label label="Setores" />
            <View className="flex flex-row flex-wrap">
                {/* Recepção bloco C */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={sectors.receptionC ? "checked" : "unchecked"}
                        onPress={() => {
                            setSectors({ ...sectors, receptionC: !sectors.receptionC });
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Recep. C"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                receptionC: !sectors.receptionC,
                            });
                        }}
                    />
                </View>

                {/* Recepção bloco G */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={sectors.receptionG ? "checked" : "unchecked"}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                receptionG: !sectors.receptionG,
                            });
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Recep. G"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                receptionG: !sectors.receptionG,
                            });
                        }}
                    />
                </View>

                {/* Apoio */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={sectors.medicalSupport ? "checked" : "unchecked"}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                medicalSupport: !sectors.medicalSupport,
                            });
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Apoio"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                medicalSupport: !sectors.medicalSupport,
                            });
                        }}
                    />
                </View>

                {/* Observação */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={sectors.observation ? "checked" : "unchecked"}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                observation: !sectors.observation,
                            });
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Observação"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                observation: !sectors.observation,
                            });
                        }}
                    />
                </View>

                {/* Fast Clínica */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={sectors.fastCLM ? "checked" : "unchecked"}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                fastCLM: !sectors.fastCLM,
                            });
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Fast CLM"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                fastCLM: !sectors.fastCLM,
                            });
                        }}
                    />
                </View>

                {/* Fast Medicação */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={sectors.fastMedication ? "checked" : "unchecked"}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                fastMedication: !sectors.fastMedication,
                            });
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Fast Med."
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                fastMedication: !sectors.fastMedication,
                            });
                        }}
                    />
                </View>

                {/* Concierge */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={sectors.concierge ? "checked" : "unchecked"}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                concierge: !sectors.concierge,
                            });
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Concierge"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                        onPress={() => {
                            setSectors({
                                ...sectors,
                                concierge: !sectors.concierge,
                            });
                        }}
                    />
                </View>
            </View>

            {/* Botão de salvar */}
            <TouchableOpacity
                activeOpacity={0.78}
                className="mt-7 w-full bg-primary-600 h-12 rounded-3xl flex justify-center items-center"
                onPress={saveEmployee}
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
