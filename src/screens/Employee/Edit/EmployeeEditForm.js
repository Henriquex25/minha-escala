import {useState} from "react";
import {TouchableOpacity, View, Text, Platform, ToastAndroid} from "react-native";
import {Checkbox, TextInput} from "react-native-paper";
import {storage} from "../../../Storage";
import Label from "../../../components/Label";
import {globalStyle} from "../../../globalStyle";

export default function EmployeeEditForm({
                                             employee, navigation, hideModal = () => {
    }
                                         }) {
    const [name, setName] = useState(employee.name);
    const [leadership, setLeadership] = useState(employee.leadership);
    const [firstReference, setFirstReference] = useState(employee.firstReference);
    const [secondReference, setSecondReference] = useState(employee.secondReference);
    const [receptionC, setReceptionC] = useState(employee.sectors.receptionC);
    const [receptionG, setReceptionG] = useState(employee.sectors.receptionG);
    const [medicalSupport, setMedicalSupport] = useState(employee.sectors.medicalSupport);
    const [observation, setObservation] = useState(employee.sectors.observation);
    const [fastCLM, setFastCLM] = useState(employee.sectors.fastCLM);
    const [fastCollect, setFastCollect] = useState(employee.sectors.fastCollect);
    const [fastMedication, setFastMedication] = useState(employee.sectors.fastMedication);
    const [concierge, setConcierge] = useState(employee.sectors.concierge);

    function saveEmployee() {
        const employees = JSON.parse(storage.getString("employees"));
        const employeeIndex = employees.findIndex((e) => e.id === employee.id);
        const newEmployeeData = {
            id: employee.id,
            name: name,
            leadership: leadership,
            firstReference: firstReference,
            secondReference: secondReference,
            sectors: {
                receptionC: receptionC,
                receptionG: receptionG,
                medicalSupport: medicalSupport,
                observation: observation,
                fastCLM: fastCLM,
                fastCollect: fastCollect,
                fastMedication: fastMedication,
                concierge: concierge,
            },
        };

        employees[employeeIndex] = newEmployeeData;

        storage.set("employees", JSON.stringify(employees));

        if (Platform.OS === "android") {
            ToastAndroid.show("Dados atualizados com sucesso ✓", ToastAndroid.SHORT);
        }

        navigation.goBack();
    }

    return (
        <>
            <Label label="Nome"/>
            <TextInput
                value={name}
                onChangeText={setName}
                textColor={"#e5e7eb"}
                style={{backgroundColor: "#3a3a40", marginBottom: 20}}
            />

            {/* Liderança e referências */}
            <Label label="Liderança e referências"/>
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
                        style={{color: "#9ca3af", paddingLeft: 0, paddingRight: 0}}
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
                        style={{color: "#9ca3af", paddingLeft: 0, paddingRight: 0}}
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
                        style={{color: "#9ca3af", paddingLeft: 0, paddingRight: 0}}
                        onPress={() => {
                            setSecondReference(!secondReference);
                        }}
                    />
                </View>
            </View>

            {/* Setores */}
            <Label label="Setores"/>
            <View className="flex flex-row flex-wrap">
                {/* Recepção bloco C */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={receptionC ? "checked" : "unchecked"}
                        onPress={() => {
                            setReceptionC(!receptionC);
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Recep. C"
                        style={{color: "#9ca3af", paddingLeft: 0, paddingRight: 0}}
                        onPress={() => {
                            setReceptionC(!receptionC);
                        }}
                    />
                </View>

                {/* Recepção bloco G */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={receptionG ? "checked" : "unchecked"}
                        onPress={() => {
                            setReceptionG(!receptionG);
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Recep. G"
                        style={{color: "#9ca3af", paddingLeft: 0, paddingRight: 0}}
                        onPress={() => {
                            setReceptionG(!receptionG);
                        }}
                    />
                </View>

                {/* Apoio */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={medicalSupport ? "checked" : "unchecked"}
                        onPress={() => {
                            setMedicalSupport(!medicalSupport);
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Apoio"
                        style={{color: "#9ca3af", paddingLeft: 0, paddingRight: 0}}
                        onPress={() => {
                            setMedicalSupport(!medicalSupport);
                        }}
                    />
                </View>

                {/* Observação */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={observation ? "checked" : "unchecked"}
                        onPress={() => {
                            setObservation(!observation);
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Observação"
                        style={{color: "#9ca3af", paddingLeft: 0, paddingRight: 0}}
                        onPress={() => {
                            setObservation(!observation);
                        }}
                    />
                </View>

                {/* Fast Clínica */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={fastCLM ? "checked" : "unchecked"}
                        onPress={() => {
                            setFastCLM(!fastCLM);
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Fast CLM"
                        style={{color: "#9ca3af", paddingLeft: 0, paddingRight: 0}}
                        onPress={() => {
                            setFastCLM(!fastCLM);
                        }}
                    />
                </View>

                {/* Fast Coleta */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={fastCollect ? "checked" : "unchecked"}
                        onPress={() => {
                            setFastCollect(!fastCollect);
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Fast Coleta"
                        style={{color: "#9ca3af", paddingLeft: 0, paddingRight: 0}}
                        onPress={() => {
                            setFastCollect(!fastCollect);
                        }}
                    />
                </View>

                {/* Fast Medicação */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={fastMedication ? "checked" : "unchecked"}
                        onPress={() => {
                            setFastMedication(!fastMedication);
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Fast Med."
                        style={{color: "#9ca3af", paddingLeft: 0, paddingRight: 0}}
                        onPress={() => {
                            setFastMedication(!fastMedication);
                        }}
                    />
                </View>

                {/* Concierge */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={concierge ? "checked" : "unchecked"}
                        onPress={() => {
                            setConcierge(!concierge);
                        }}
                        color={globalStyle.theme.primary}
                    />
                    <Label
                        label="Concierge"
                        style={{color: "#9ca3af", paddingLeft: 0, paddingRight: 0}}
                        onPress={() => {
                            setConcierge(!concierge);
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
                <Text className="text-gray-200 text-center text-lg">Salvar</Text>
            </TouchableOpacity>

            {/* Botão de voltar */}
            <TouchableOpacity
                activeOpacity={0.78}
                className="mt-3 w-full bg-transparent h-12 rounded-3xl flex justify-center items-center"
                onPress={() => navigation.goBack()}
            >
                <Text className="text-gray-200 text-center text-lg">Voltar</Text>
            </TouchableOpacity>
        </>
    );
}
