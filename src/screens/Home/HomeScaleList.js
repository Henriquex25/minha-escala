import {
    Alert,
    Platform,
    Share,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { storage } from "../../Storage";
import { FlatList } from "react-native-gesture-handler";
import { Divider, Icon } from "react-native-paper";
import { useMMKVObject } from "react-native-mmkv";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { globalStyle } from "../../globalStyle";
import Dialog from "../../components/Dialog";

export default function HomeScaleList() {
    const [scales, setScales] = useMMKVObject("scales");
    const [editScales, setEditScales] = useState({});
    const [showingDeleteDialog, setShowingDeleteDialog] = useState(false);
    const [scaleIndexToDelete, setScaleIndexToDelete] = useState(null);
    const [unsavedChanges, setUnsavedChanges] = useState([]);

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

    function getEmployeesReceptionC(scale, index) {
        if (scale.receptionC?.custom?.employess) {
            return scale.receptionC.custom.employess;
        }

        if (unsavedChanges[index]?.receptionC?.custom?.employess) {
            return unsavedChanges[index]?.receptionC?.custom?.employess;
        }

        const employees = scale.receptionC;
        const time = "🍝 22:50 às 23:10 / 🛏 04:00 às 05:00";
        let value = "";
        let firstItem = true;

        employees?.forEach((employee) => {
            value += `${firstItem ? "" : "\n\n"}${employee.name} ${time}`;

            firstItem = false;
        });

        return value ? value : "--";
    }

    function getEmployeesReceptionG(item) {
        const employees = item.receptionG;
        const times = getTimesReceptionG(employees?.length ?? 0);
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

    function getTimesReceptionG(employeesLength) {
        const times = [
            "🍝 21:10 às 21:30 / 🛏 00:00 às 01:00",
            "🍝 21:30 às 21:50 / 🛏 01:00 às 02:00",
            "🍝 21:50 às 22:10 / 🛏 02:00 às 03:00",
            "🍝 22:10 às 22:30 / 🛏 03:00 às 04:00",
        ];

        if (employeesLength == 7) {
            return times.concat([
                "🍝 22:30 às 22:50 / 🛏 04:00 às 05:00",
                "🍝 22:40 às 23:00 / 🛏 04:00 às 05:00",
                "🍝 22:50 às 23:10 / 🛏 05:00 às 06:00",
            ]);
        }

        if (employeesLength == 8) {
            return times.concat([
                "🍝 22:30 às 22:50 / 🛏 04:00 às 05:00",
                "🍝 22:40 às 23:00 / 🛏 04:00 às 05:00",
                "🍝 22:50 às 23:10 / 🛏 05:00 às 06:00",
                "🍝 23:00 às 23:20 / 🛏 05:00 às 06:00",
            ]);
        }

        return times.concat([
            "🍝 22:30 às 22:50 / 🛏 04:00 às 05:00",
            "🍝 22:50 às 23:10 / 🛏 05:00 às 06:00",
        ]);
    }

    function getEmployeesMedicalSupport(item) {
        const employees = item.medicalSupport;

        const times = [
            "🍝 22:40 às 23:00 / 🛏 03:00 às 04:00",
            "🍝 23:00 às 23:20 / 🛏 04:00 às 05:00",
        ];

        if (employees?.length == 3) {
            times.unshift("🍝 22:20 às 22:40 / 🛏 02:00 às 03:00");
        }

        let value = "";
        let firstItem = true;

        employees?.forEach((employee, index) => {
            const i = index + (times.length - employees.length);
            const time = times[i] ?? "(Sem horário definido)";

            value += `${firstItem ? "" : "\n\n"}${employee.name} ${time}`;

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

    function getScaleInText(scale, index) {
        return `*Noturno B*\n\n${getEmployeeResponsibleForTheDay(scale)}\nDimensionamento ${
            scale.date
        }\n\n*${("0" + scale.receptionC.length).slice(
            -2
        )} Func. Recepção bloco C*${getEmployeesReceptionC(
            scale,
            index
        )}\n___________________\n\n*01 Func. Totem*\n*01 Func. Orientador*\n*${(
            "0" +
            (scale.receptionG.length - 2)
        ).slice(
            -2
        )} Func. Recepção bloco G*\n*(equipe faz revezamento entre os locais acima)*\n ${getEmployeesReceptionG(
            scale
        )}\n___________________\n\n*${("0" + scale.medicalSupport.length).slice(
            -2
        )} Func. Apoio Médico*${getEmployeesMedicalSupport(scale)}\n___________________\n\n*${(
            "0" + scale.concierge.length
        ).slice(-2)} Func. Concierge*\n${getEmployeesConcierge(scale)}\n___________________\n\n*${(
            "0" + scale.fastCLM.length
        ).slice(-2)} Func. Fast Clínica Médica*\n${getEmployeesFastCLM(
            scale
        )}\n___________________\n\n*${("0" + scale.fastCollect.length).slice(
            -2
        )} Func. Fast Coleta*\n${getEmployeesFastCollect(scale)}\n___________________\n\n*${(
            "0" + scale.observation.length
        ).slice(-2)} Func. Observação*\n${getEmployeesObservation(
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
    }

    async function copyToClipboard(index) {
        const scale = scales[index];

        await Clipboard.setStringAsync(getScaleInText(scale, index));

        if (Platform.OS === "android") {
            ToastAndroid.show("Copiado!", ToastAndroid.SHORT);
        }
    }

    async function shareScale(index) {
        const scale = scales[index];

        try {
            await Share.share({
                message: getScaleInText(scale, index),
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    function startScaleEditing(index) {
        setEditScales((prevState) => ({ ...prevState, [index]: true }));
    }

    function cancelScaleEditing(sectorId) {
        const changes = [...unsavedChanges];

        changes[sectorId] = [];

        setUnsavedChanges(changes);

        setEditScales((prevState) => ({ ...prevState, [sectorId]: false }));
    }

    function whenModificationIsInitiated(sectorID, index, modification, value) {
        setUnsavedChanges((prevState) => {
            const state = [...prevState];

            if (!state[index]?.[sectorID]) {
                state[index] = {
                    ...state[index],
                    [sectorID]: {
                        [modification]: value,
                    },
                };

                return state;
            }

            state[index][sectorID][modification] = value;

            return state;
        });
    }

    function saveScaleEdit(index) {}

    const renderItem = ({ item, index }) => {
        return (
            <View
                className="bg-default-3 mt-3 rounded-lg border px-4 py-3.5"
                style={{
                    borderColor: editScales[index] === true ? globalStyle.theme.primary : "#1f2937",
                }}
            >
                {/* Cabeçalho */}
                <View className="pb-3">
                    <View className="flex flex-row justify-between">
                        <View>
                            <Text className="font-bold text-gray-200">Noturno B</Text>
                        </View>

                        {/* Botões */}
                        <View className="flex flex-row space-x-3 items-center -mt-2">
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
                            {/*{!editScales[index] === true && (*/}
                            {/*    <TouchableOpacity*/}
                            {/*        activeOpacity={0.69}*/}
                            {/*        onPress={() => startScaleEditing(index)}*/}
                            {/*    >*/}
                            {/*        <Icon source={"pencil-outline"} size={20} color="gray"/>*/}
                            {/*    </TouchableOpacity>*/}
                            {/*)}*/}

                            {/* Salvar Edição */}
                            {editScales[index] === true && (
                                <TouchableOpacity
                                    activeOpacity={0.69}
                                    onPress={() => saveScaleEdit(index)}
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
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.employeeResponsibleForTheDay?.label
                                ? unsavedChanges[index].employeeResponsibleForTheDay.label
                                : getEmployeeResponsibleForTheDay(item)
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated(
                                "employeeResponsibleForTheDay",
                                index,
                                "label",
                                text
                            )
                        }
                    />
                    <Text className="text-gray-200 -mt-1">Dimensionamento {item.date}</Text>
                </View>

                {/* Recepção C */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.receptionC?.label
                                ? unsavedChanges[index].receptionC.label
                                : `${("0" + item.receptionC.length).slice(
                                      -2
                                  )} Func. Recepção bloco C`
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("receptionC", index, "label", text)
                        }
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.receptionC?.employees
                                ? unsavedChanges[index].receptionC.employees
                                : getEmployeesReceptionC(item, index)
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("receptionC", index, "employees", text)
                        }
                    />
                </View>

                <Divider className="my-3" />

                {/* Recepção G */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        multiline
                        spellCheck={false}
                        numberOfLines={4}
                        value={
                            unsavedChanges[index]?.receptionG?.label
                                ? unsavedChanges[index].receptionG.label
                                : `01 Func. Totem \n01 Func. Orientador \n${(
                                      "0" +
                                      (item.receptionG.length - 2)
                                  ).slice(
                                      -2
                                  )} Func. Recepção bloco G \n(equipe faz revezamento entre os locais acima)`
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("receptionG", index, "label", text)
                        }
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.receptionG?.employees
                                ? unsavedChanges[index].receptionG.employees
                                : getEmployeesReceptionG(item)
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("receptionG", index, "employees", text)
                        }
                    />
                </View>

                <Divider className="my-3" />

                {/* Apoio Médico */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.medicalSupport?.label
                                ? unsavedChanges[index].medicalSupport.label
                                : `${("0" + item.medicalSupport.length).slice(
                                      -2
                                  )} Func. Apoio Médico`
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("medicalSupport", index, "label", text)
                        }
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.medicalSupport?.employees
                                ? unsavedChanges[index].medicalSupport.employees
                                : getEmployeesMedicalSupport(item)
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("medicalSupport", index, "employees", text)
                        }
                    />
                </View>

                <Divider className="my-3" />

                {/* Concierge */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.concierge?.label
                                ? unsavedChanges[index].concierge.label
                                : `${("0" + item.concierge.length).slice(-2)} Func. Concierge`
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("concierge", index, "label", text)
                        }
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.concierge?.employees
                                ? unsavedChanges[index].concierge.employees
                                : getEmployeesConcierge(item)
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("concierge", index, "employees", text)
                        }
                    />
                </View>

                <Divider className="my-3" />

                {/* Fast Clínica */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.fastCLM?.label
                                ? unsavedChanges[index].fastCLM.label
                                : `${("0" + item.fastCLM.length).slice(
                                      -2
                                  )} Func. Fast Clínica Médica`
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("fastCLM", index, "label", text)
                        }
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.fastCLM?.employees
                                ? unsavedChanges[index].fastCLM.employees
                                : getEmployeesFastCLM(item)
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("fastCLM", index, "employees", text)
                        }
                    />
                </View>

                <Divider className="my-3" />

                {/* Fast Coleta */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.fastCollect?.label
                                ? unsavedChanges[index].fastCollect.label
                                : `${("0" + item.fastCollect.length).slice(-2)} Func. Fast Coleta`
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("fastCollect", index, "label", text)
                        }
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.fastCollect?.employees
                                ? unsavedChanges[index].fastCollect.employees
                                : getEmployeesFastCollect(item)
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("fastCollect", index, "employees", text)
                        }
                    />
                </View>

                <Divider className="my-3" />

                {/* Observação */}
                <View>
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="font-semibold text-gray-200"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.observation?.label
                                ? unsavedChanges[index].observation.label
                                : `${("0" + item.observation.length).slice(-2)} Func. Observação`
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("observation", index, "label", text)
                        }
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.observation?.employees
                                ? unsavedChanges[index].observation.employees
                                : getEmployeesObservation(item)
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated("observation", index, "employees", text)
                        }
                    />
                </View>

                <Divider className="my-3" />

                {/* Ausências programadas */}
                <View>
                    <Text className="text-gray-200 -mt-1 font-bold">
                        Ausências programadas {"\n"}
                    </Text>
                    <TextInput
                        className="text-gray-200 font-semibold"
                        readOnly={!editScales[index] === true}
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.scheduledAbsences?.daysOffLabel
                                ? unsavedChanges[index].scheduledAbsences.daysOffLabel
                                : `Folgas - ${("0" + item.daysOff.length).slice(-2)}`
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated(
                                "scheduledAbsences",
                                index,
                                "daysOffLabel",
                                text
                            )
                        }
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200 -mt-0.5"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.scheduledAbsences?.daysOffEmployees
                                ? unsavedChanges[index].scheduledAbsences.daysOffEmployees
                                : getEmployeesDaysOff(item)
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated(
                                "scheduledAbsences",
                                index,
                                "daysOffEmployees",
                                text
                            )
                        }
                    />
                    <TextInput
                        className="text-gray-200 font-semibold mt-4"
                        readOnly={!editScales[index] === true}
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.scheduledAbsences?.vacationsLabel
                                ? unsavedChanges[index].scheduledAbsences.vacationsLabel
                                : `Férias - ${("0" + item.vacations.length).slice(-2)}`
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated(
                                "scheduledAbsences",
                                index,
                                "vacationsLabel",
                                text
                            )
                        }
                    />
                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200 -mt-1"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.scheduledAbsences?.vacationsEmployees
                                ? unsavedChanges[index].scheduledAbsences.vacationsEmployees
                                : getEmployeesVacations(item)
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated(
                                "scheduledAbsences",
                                index,
                                "vacationsEmployees",
                                text
                            )
                        }
                    />
                </View>

                <Divider className="my-3" />

                {/* Ausências não programadas */}
                <View>
                    <Text className="text-gray-200 -mt-1 font-bold">
                        Ausências não programadas {"\n"}
                    </Text>
                    <TextInput
                        className="text-gray-200 font-semibold"
                        readOnly={!editScales[index] === true}
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.unscheduledAbsences?.medicalCertificatesLabel
                                ? unsavedChanges[index].unscheduledAbsences.medicalCertificatesLabel
                                : `Atestados / Outros - ${(
                                      "0" + item.medicalCertificates.length
                                  ).slice(-2)}`
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated(
                                "unscheduledAbsences",
                                index,
                                "medicalCertificatesLabel",
                                text
                            )
                        }
                    />

                    <TextInput
                        readOnly={!editScales[index] === true}
                        className="text-gray-200 -mt-0.5"
                        multiline
                        spellCheck={false}
                        value={
                            unsavedChanges[index]?.unscheduledAbsences?.medicalCertificatesEmployees
                                ? unsavedChanges[index].unscheduledAbsences
                                      .medicalCertificatesEmployees
                                : getEmployeesMedicalCertificates(item)
                        }
                        onChangeText={(text) =>
                            whenModificationIsInitiated(
                                "unscheduledAbsences",
                                index,
                                "medicalCertificatesEmployees",
                                text
                            )
                        }
                    />
                </View>
            </View>
        );
    };

    return (
        <View>
            {scales?.length > 0 ? (
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
                onConfirm={() => {
                    setScales((oldScales) =>
                        oldScales.filter((_, index) => index !== scaleIndexToDelete)
                    );
                    setShowingDeleteDialog(false);
                    setScaleIndexToDelete(0);
                }}
            />
        </View>
    );
}
