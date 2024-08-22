import {useEffect, useState} from "react";
import {View, FlatList, Text} from "react-native";
import {Portal, Modal, Button} from "react-native-paper";
import {storage} from "../../../Storage";
import moment from "moment";
import Title from "../../../components/layout/Title";
import {TouchableOpacity} from "react-native-gesture-handler";
import Dialog from "../../../components/Dialog";

export default function GenerateScaleDaysOffList({
                                                     visible = false, hideModal = () => {
    }, navigation = () => {
    }
                                                 }) {
    const [daysOff, setDaysOff] = useState([]);
    const [showingDeleteDialog, setShowingDeleteDialog] = useState(false);
    const [employeeIdToDelete, setEmployeeIdToDelete] = useState(0);

    function deleteEmployeeDaysOff() {
        const generateScales = storage.getString("generate-scales");
        const generateScalesObj = generateScales ? JSON.parse(generateScales) : {};

        generateScalesObj.daysOff = generateScalesObj.daysOff.filter((d) => d.employee.id !== employeeIdToDelete);

        storage.set("generate-scales", JSON.stringify(generateScalesObj));

        setShowingDeleteDialog(false);
    }

    function plainTextDates(dts) {
        return dts.join(", ");
    }

    function fetchDaysOffToGenerateScales() {
        const existingGenerateScales = storage.getString("generate-scales");

        const generateScales = existingGenerateScales ? JSON.parse(existingGenerateScales) : {};

        if (Object.keys(generateScales).length === 0 || !generateScales.daysOff || generateScales.daysOff?.length === 0) {
            setDaysOff([]);

            return;
        }

        setDaysOff(generateScales.daysOff);
    }

    useEffect(() => {
        const listener = storage.addOnValueChangedListener((changedKey) => {
            if (changedKey === "generate-scales") {
                fetchDaysOffToGenerateScales();
            }
        });

        return () => listener.remove();
    }, []);

    useEffect(() => fetchDaysOffToGenerateScales(), []);

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hideModal}
                className="px-2"
                contentContainerStyle={{backgroundColor: "#2a2a2e", padding: 20, borderRadius: 9}}
            >
                <Title title="Folgas" className="text-gray-400 mt-0"/>

                <Button mode="elevated" onPress={() => navigation.navigate("DaysOffCreate")} className="mb-2">
                    Adicionar
                </Button>

                {daysOff.length > 0 ? (
                    <View>
                        <FlatList
                            data={daysOff}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    className="bg-default-3 pl-2.5 py-2 rounded-lg mb-2 whitespace-wrap text-wrap"
                                    activeOpacity={0.78}
                                    onLongPress={() => {
                                        setEmployeeIdToDelete(item.employee.id);
                                        setShowingDeleteDialog(true);
                                    }}
                                >
                                    <Text className="w-[30%] text-gray-200 truncate font-semibold">{item.employee.name}</Text>
                                    <Text className="text-gray-300">{plainTextDates(item.dates)}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.employee?.id ?? Math.random().toString()}
                        />

                        <Dialog
                            visible={showingDeleteDialog}
                            hideDialog={() => setShowingDeleteDialog(false)}
                            onConfirm={deleteEmployeeDaysOff}
                            message="Tem certeza que deseja excluir estas folgas?"
                        />
                    </View>
                ) : (
                    <Text className="text-gray-500 text-center">Nenhuma folga adicionada</Text>
                )}

                <TouchableOpacity
                    activeOpacity={0.78}
                    className="self-end px-3 py-2 mt-5"
                    onPress={hideModal}
                >
                    <Text className="text-gray-400">FECHAR</Text>
                </TouchableOpacity>
            </Modal>
        </Portal>
    );
}
