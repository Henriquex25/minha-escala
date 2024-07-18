import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Checkbox, TextInput } from "react-native-paper";
import Label from "../Label";

export default function CreateEmployee() {
    const [receptionC, setReceptionC] = useState("");
    const [receptionG, setReceptionG] = useState(false);
    const [medicalSupport, setMedicalSupport] = useState(false);
    const [observation, setObservation] = useState(false);
    const [fastCLM, setFastCLM] = useState(false);
    const [fastCollect, setFastCollect] = useState(false);
    const [concierge, setConcierge] = useState(false);

    return (
        <>
            <TextInput label="Nome" style={{ backgroundColor: "#3a3a40", marginBottom: 20 }} />

            {/* Setores */}
            <Label label="Setores" />
            <View className="flex flex-row flex-wrap">
                {/* Recepção bloco C */}
                <View className="w-5/12 flex flex-row items-center">
                    <Checkbox
                        status={receptionC ? "checked" : "unchecked"}
                        onPress={() => {
                            setReceptionC(!receptionC);
                        }}
                    />
                    <Label
                        label="Recep. C"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
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
                    />
                    <Label
                        label="Recep. G"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
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
                    />
                    <Label
                        label="Apoio"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
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
                    />
                    <Label
                        label="Observação"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
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
                    />
                    <Label
                        label="Fast CLM"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
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
                    />
                    <Label
                        label="Fast Coleta"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                        onPress={() => {
                            setFastCollect(!fastCollect);
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
                    />
                    <Label
                        label="Concierge"
                        style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                        onPress={() => {
                            setConcierge(!concierge);
                        }}
                    />
                </View>
            </View>

            {/* Botão de salvar */}
            <TouchableOpacity activeOpacity={0.78} className="mt-7 w-full bg-primary-600 h-12 rounded-3xl flex justify-center items-center">
                <Text className="text-gray-200 text-center text-lg">Adicionar</Text>
            </TouchableOpacity>
        </>
    );
}
