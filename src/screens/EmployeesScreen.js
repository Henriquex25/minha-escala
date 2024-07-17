import { Text, View, TouchableOpacity } from "react-native";
import Body from "../components/layout/Body";
import Title from "../components/layout/Title";
import { Checkbox, Icon, Modal, Portal } from "react-native-paper";
import TextInput from "../components/form/TextInput";
import { useState } from "react";
import Label from "../components/Label";
import colors from "tailwindcss/colors";

export default function EmployeesScreen() {
    const [visible, setVisible] = useState(false);
    const [receptionC, setReceptionC] = useState(false);
    const [receptionG, setReceptionG] = useState(false);
    const [medicalSupport, setMedicalSupport] = useState(false);
    const [observation, setObservation] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    return (
        <Body>
            <Title title="Funcionários" />

            <TouchableOpacity
                className="h-16 w-16 bg-primary-500 text-gray-200 rounded-full flex justify-center items-center absolute bottom-6 right-5"
                onPress={() => showModal(true)}
            >
                <Icon source="plus" size={22} color="white" />
            </TouchableOpacity>

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    className="px-2"
                    contentContainerStyle={{ backgroundColor: "#2a2a2e", padding: 20, borderRadius: 9 }}
                >
                    <TextInput label="Nome" style={{ backgroundColor: "#3a3a40", marginBottom: 20 }} />

                    {/* Setores */}
                    <Label label="Setores" />
                    <View className="flex flex-row flex-wrap">
                        {/* Recepção bloco C */}
                        <View className="w-1/3 flex flex-row items-center">
                            <Checkbox
                                status={receptionC ? "checked" : "unchecked"}
                                onPress={() => {
                                    setReceptionC(!receptionC);
                                }}
                            />
                            <Label
                                label="Recepção C"
                                style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                                onPress={() => {
                                    setReceptionC(!receptionC);
                                }}
                            />
                        </View>

                        {/* Recepção bloco G */}
                        <View className="w-1/3 flex flex-row items-center">
                            <Checkbox
                                status={receptionG ? "checked" : "unchecked"}
                                onPress={() => {
                                    setReceptionG(!receptionG);
                                }}
                            />
                            <Label
                                label="Recepção G"
                                style={{ color: "#9ca3af", paddingLeft: 0, paddingRight: 0 }}
                                onPress={() => {
                                    setReceptionG(!receptionG);
                                }}
                            />
                        </View>

                        {/* Apoio */}
                        <View className="w-1/3 flex flex-row items-center">
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
                        <View className="w-1/3 flex flex-row items-center">
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
                    </View>
                </Modal>
            </Portal>
        </Body>
    );
}
