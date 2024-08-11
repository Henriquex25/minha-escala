import {
    TextInput,
    View,
    Text,
    TouchableOpacity,
    Platform,
    ToastAndroid,
    Share,
    Alert,
} from "react-native";
import { storage } from "../../Storage";
import { FlatList } from "react-native-gesture-handler";
import { Divider, Icon } from "react-native-paper";
import { useMMKVObject } from "react-native-mmkv";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { globalStyle } from "../../globalStyle";
import Dialog from "../../components/Dialog";

export default function HomeScaleList() {
    const [scales, setScales] = useMMKVObject("scales");
    const [editScales, setEditScales] = useState({});
    const [showingDeleteDialog, setShowingDeleteDialog] = useState(false);
    const [scaleIndexToDelete, setScaleIndexToDelete] = useState(null);

    function getEmployeeResponsibleForTheDay(item) {
        if (item.availableEmployees.some((e) => e.name === "Henrique")) {
            return "Líder Administrativo: Henrique";
        }

        const employees = JSON.parse(storage.getString("employees") ?? "[]");
        const firstReference = employees?.find((e) => e.firstReference === true);

        if (
            item.concierge.some((e) => e.id === firstReference?.id) ||
            item.medicalSupport.some((e) => e.id === firstReference?.id) ||
            item.fastCLM.some((e) => e.id === firstReference?.id)
        ) {
            return `Referência: ${firstReference?.name}`;
        }

        const secondReference = employees?.find((e) => e.secondReference === true);

        if (
            item.concierge.some((e) => e.id === secondReference?.id) ||
            item.medicalSupport.some((e) => e.id === secondReference?.id) ||
            item.fastCLM.some((e) => e.id === secondReference?.id)
        ) {
            return `Referência: ${secondReference?.name}`;
        }

        return "Referência: ";
    }

    function getEmployeesReceptionC(item) {
        const employees = item.receptionC;
        const time = "🍝 22:50 às 23:10 / 🛏 04:00 às 05:00";
        let value = "";
        let firstItem = true;

        employees?.forEach((employee) => {
            value += `${firstItem ? "\n" : "\n\n"}${employee.name} ${time}`;

            firstItem = false;
        });

        return value ? value : "--";
    }

    function getEmployeesReceptionG(item) {
        const employees = item.receptionG;
        const times = [
            "🍝 21:10 às 21:30 / 🛏 00:00 às 01:00",
            "🍝 21:30 às 21:50 / 🛏 01:00 às 02:00",
            "🍝 21:50 às 22:10 / 🛏 02:00 às 03:00",
            "🍝 22:10 às 22:30 / 🛏 03:00 às 04:00",
            "🍝 22:30 às 22:50 / 🛏 04:00 às 05:00",
            "🍝 22:50 às 23:10 / 🛏 05:00 às 06:00",
        ];
        let value = "";
        let firstItem = true;

        employees?.forEach((employee, index) => {
            const i = index + (times.length - employees.length);
            const time = times[i] ?? "(Sem horário definido)";

            value += `${firstItem ? "\n" : "\n\n"}${employee.name} ${time}`;

            firstItem = false;
        });

        return value ? value : "--";
    }

    function getEmployeesMedicalSupport(item) {
        const employees = item.medicalSupport;

        const times = [
            "🍝 22:40 às 23:00 / 🛏 03:00 às 04:00",
            "🍝 23:00 às 23:20 / 🛏 04:00 às 05:00",
        ];
        let value = "";
        let firstItem = true;

        employees?.forEach((employee, index) => {
            const i = index + (times.length - employees.length);
            const time = times[i] ?? "(Sem horário definido)";

            value += `${firstItem ? "\n" : "\n\n"}${employee.name} ${time}`;

            firstItem = false;
        });

        return value ? value : "--";
    }

    function getEmployeesConcierge(item) {
        const employees = item.concierge;
        const time = "🍝 21:00 às 21:20 / 🛏 05:00 às 06:00";
        let value = "";
        let firstItem = true;

        employees?.forEach((employee) => {
            value += `${firstItem ? "" : "\n\n"}${employee.name} ${time}`;

            firstItem = false;
        });

        return value ? value : "--";
    }

    function getEmployeesFastCLM(item) {
        const employees = item.fastCLM;
        const time = "🍝 21:20 às 21:40 / 🛏 03:00 às 04:00";
        let value = "";
        let firstItem = true;

        employees?.forEach((employee) => {
            value += `${firstItem ? "" : "\n\n"}${employee.name} ${time}`;

            firstItem = false;
        });

        return value ? value : "--";
    }

    function getEmployeesFastCollect(item) {
        const employees = item.fastCollect;
        const time = "🍝 21:40 às 22:00 / 🛏 02:00 às 03:00";
        let value = "";
        let firstItem = true;

        employees?.forEach((employee) => {
            value += `${firstItem ? "" : "\n\n"}${employee.name} ${time}`;

            firstItem = false;
        });

        return value ? value : "--";
    }

    function getEmployeesObservation(item) {
        const employees = item.observation;
        const time = "🍝 22:00 às 22:20 / 🛏 02:00 às 03:00";
        let value = "";
        let firstItem = true;

        employees?.forEach((employee) => {
            value += `${firstItem ? "" : "\n\n"}${employee.name} ${time}`;

            firstItem = false;
        });

        return value ? value : "--";
    }

    function getEmployeesDaysOff(item) {
        const employees = item.daysOff;
        let value = "";

        employees?.forEach(
            (employee, index) => (value += `${index === 0 ? "" : "\n"}${employee.name}`)
        );

        return value;
    }

    function getEmployeesVacations(item) {
        const employees = item.vacations;
        let value = "";

        employees?.forEach(
            (employee, index) => (value += `${index === 0 ? "" : "\n"}${employee.name}`)
        );

        return value;
    }

    function getEmployeesMedicalCertificates(item) {
        const employees = item.medicalCertificates;
        let value = "";

        employees?.forEach(
            (employee, index) => (value += `${index === 0 ? "" : "\n"}${employee.name}`)
        );

        return value;
    }

    function getScaleInText(scale) {
        const content = `*Noturno B*\n\n${getEmployeeResponsibleForTheDay(
            scale
        )}\nDimensionamento ${scale.date}\n\n*${("0" + scale.receptionC.length).slice(
            -2
        )} Func. Recepção bloco C*\n ${getEmployeesReceptionC(
            scale
        )}\n___________________\n\n*01 Func. Totem*\n*01 Func. Orientador*\n*${(
            "0" + scale.receptionG.length
        ).slice(
            -2
        )} Func. Recepção bloco G*\n*(equipe faz revezamento entre os locais acima)*\n ${getEmployeesReceptionG(
            scale
        )}\n___________________\n\n*${("0" + scale.medicalSupport.length).slice(
            -2
        )} Func. Apoio Médico*\n${getEmployeesMedicalSupport(scale)}\n___________________\n\n*${(
            "0" + scale.concierge.length
        ).slice(-2)} Func. Concierge*\n${getEmployeesConcierge(scale)}\n___________________\n\n*${(
            "0" + scale.fastCLM.length
        ).slice(-2)} Func. Fast Clínica Médica*\n${getEmployeesFastCLM(
            scale
        )}\n___________________\n\n*${("0" + scale.fastCollect.length).slice(
            -2
        )} Func. Fast Coleta*\n\n${getEmployeesFastCollect(scale)}\n___________________\n\n*${(
            "0" + scale.observation.length
        ).slice(-2)} Func. Observação*\n\n${getEmployeesObservation(
            scale
        )}\n___________________\n\n*Ausências programadas*\n\n*Folgas - ${(
            "0" + scale.daysOff.length
        ).slice(-2)}*\n${getEmployeesDaysOff(scale)}\n\n*Férias - ${(
            "0" + scale.vacations.length
        ).slice(-2)}*\n${getEmployeesVacations(
            scale
        )}\n___________________\n\n*Ausências não programadas*\n\n*Atestados / Outros - ${(
            "0" + scale.medicalCertificates.length
        ).slice(-2)}*\n${getEmployeesMedicalCertificates(scale)}`;

        return content;
    }

    async function copyToClipboard(index) {
        const scale = scales[index];

        await Clipboard.setStringAsync(getScaleInText(scale));

        if (Platform.OS === "android") {
            ToastAndroid.show("Copiado!", ToastAndroid.SHORT);
        }
    }

    async function shareScale(index) {
        const scale = scales[index];

        try {
            const result = await Share.share({
                message: getScaleInText(scale),
            });

            if (result.action === Share.sharedAction) {
                ToastAndroid.show("Compartilhado!", ToastAndroid.SHORT);
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    function startScaleEditing(id) {
        setEditScales((prevState) => ({ ...prevState, [id]: true }));
    }

    function cancelScaleEditing(id) {
        setEditScales((prevState) => ({ ...prevState, [id]: false }));
    }

    function saveScaleEdit(id) {}

    const renderItem = ({ item, index }) => {
        return (
            <View
                className="bg-default-2 mt-3 rounded-lg border px-4 py-3.5"
                style={{
                    borderColor: editScales[index] === true ? globalStyle.theme.primary : "#1f2937",
                }}
            >
                {/* Cabeçalho */}
                <View className="pb-3">
                    <View className="flex flex-row justify-between">
                        <View>
                            <TextInput className="font-bold text-gray-200" value="Noturno B" />
                        </View>

                        {/* Botões */}
                        <View className="flex flex-row space-x-2.5 items-center -mt-2">
                            {/* Copiar */}
                            {!editScales[index] === true && (
                                <TouchableOpacity
                                    activeOpacity={0.69}
                                    onPress={() => copyToClipboard(index)}
                                >
                                    <Icon source={"content-copy"} size={20} color="gray" />
                                </TouchableOpacity>
                            )}

                            {/* Compartilhar */}
                            {!editScales[index] === true && (
                                <TouchableOpacity
                                    activeOpacity={0.69}
                                    onPress={() => shareScale(index)}
                                >
                                    <Icon source={"share-variant-outline"} size={20} color="gray" />
                                </TouchableOpacity>
                            )}

                            {/* Editar */}
                            {!editScales[index] === true && (
                                <TouchableOpacity
                                    activeOpacity={0.69}
                                    onPress={() => startScaleEditing(index)}
                                >
                                    <Icon source={"pencil-outline"} size={20} color="gray" />
                                </TouchableOpacity>
                            )}

                            {/* Salvar Edição */}
                            {editScales[index] === true && (
                                <TouchableOpacity
                                    activeOpacity={0.69}
                                    onPress={() => startScaleEditing(index)}
                                    className="p-1"
                                >
                                    <Icon
                                        source={"check"}
                                        size={21}
                                        color={globalStyle.theme.primary}
                                    />
                                </TouchableOpacity>
                            )}

                            {/* Cancelar edição */}
                            {editScales[index] === true && (
                                <TouchableOpacity
                                    activeOpacity={0.69}
                                    onPress={() => cancelScaleEditing(index)}
                                    className="p-1"
                                >
                                    <Text className="text-red-500" style={{ fontSize: 17 }}>
                                        X
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* Excluir */}
                            {!editScales[index] === true && (
                                <TouchableOpacity
                                    activeOpacity={0.69}
                                    onPress={() => {
                                        setScaleIndexToDelete(index);
                                        setShowingDeleteDialog(true);
                                    }}
                                >
                                    <Icon source={"trash-can-outline"} size={20} color="gray" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        multiline
                        value={getEmployeeResponsibleForTheDay(item)}
                    />
                    <Text className="text-gray-200 -mt-1">Dimensionamento {item.date}</Text>
                </View>

                {/* Recepção C */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        value={`${("0" + item.receptionC.length).slice(-2)} Func. Recepção bloco C`}
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        multiline
                        value={getEmployeesReceptionC(item)}
                    />
                </View>

                <Divider className="my-3" />

                {/* Recepção G */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        multiline
                        numberOfLines={4}
                        value={`01 Func. Totem \n01 Func. Orientador \n${(
                            "0" +
                            (item.receptionG.length - 2)
                        ).slice(
                            -2
                        )} Func. Recepção bloco G \n(equipe faz revezamento entre os locais acima)`}
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        multiline
                        value={getEmployeesReceptionG(item)}
                    />
                </View>

                <Divider className="my-3" />

                {/* Apoio Médico */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        multiline
                        value={`${("0" + item.medicalSupport.length).slice(-2)} Func. Apoio Médico`}
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        value={getEmployeesMedicalSupport(item)}
                        multiline
                    />
                </View>

                <Divider className="my-3" />

                {/* Concierge */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        multiline
                        value={`${("0" + item.concierge.length).slice(-2)} Func. Concierge`}
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        value={getEmployeesConcierge(item)}
                        multiline
                    />
                </View>

                <Divider className="my-3" />

                {/* Fast Clínica */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        multiline
                        value={`${("0" + item.fastCLM.length).slice(-2)} Func. Fast Clínica Médica`}
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        value={getEmployeesFastCLM(item)}
                        multiline
                    />
                </View>

                <Divider className="my-3" />

                {/* Fast Coleta */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        multiline
                        value={`${("0" + item.fastCollect.length).slice(-2)} Func. Fast Coleta`}
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        value={getEmployeesFastCollect(item)}
                        multiline
                    />
                </View>

                <Divider className="my-3" />

                {/* Observação */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        multiline
                        value={`${("0" + item.observation.length).slice(-2)} Func. Observação`}
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        value={getEmployeesObservation(item)}
                        multiline
                    />
                </View>

                <Divider className="my-3" />

                {/* Ausências programadas */}
                <View>
                    <Text className="text-gray-200 -mt-1 font-bold">
                        Ausências programadas {"\n"}
                    </Text>
                    <TextInput className="text-gray-200 font-semibold">
                        Folgas - {("0" + item.daysOff.length).slice(-2)}
                    </TextInput>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200 -mt-0.5"
                        value={getEmployeesDaysOff(item)}
                        multiline
                    />
                    <TextInput className="text-gray-200 font-semibold mt-4">
                        Férias - {("0" + item.vacations.length).slice(-2)}
                    </TextInput>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200 -mt-1"
                        value={getEmployeesVacations(item)}
                        multiline
                    />
                </View>

                <Divider className="my-3" />

                {/* Ausências não programadas */}
                <View>
                    <Text className="text-gray-200 -mt-1 font-bold">
                        Ausências não programadas {"\n"}
                    </Text>
                    <TextInput className="text-gray-200 font-semibold">
                        Atestados / Outros - {("0" + item.medicalCertificates.length).slice(-2)}
                    </TextInput>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200 -mt-0.5"
                        value={getEmployeesMedicalCertificates(item)}
                        multiline
                    />
                </View>
            </View>
        );
    };

    return (
        <View>
            {scales.length > 0 ? (
                <FlatList
                    data={scales}
                    keyExtractor={(item, index) => `${item.date}-${index}`}
                    renderItem={renderItem}
                />
            ) : (
                <Text className="text-center text-gray-400 pt-5">Nenhuma escala gerada...</Text>
            )}

            <Dialog
                visible={showingDeleteDialog}
                hideDialog={() => setShowingDeleteDialog(false)}
                message="Tem certeza de que gostaria de excluir esta escala?"
                onConfirm={() =>
                    setScales((prevScales) => prevScales.splice(scaleIndexToDelete, 1))
                }
            />
        </View>
    );
}
