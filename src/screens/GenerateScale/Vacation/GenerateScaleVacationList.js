import { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { Portal, Modal, Button } from "react-native-paper";
import { storage } from "../../../Storage";
import moment from "moment";
import Title from "../../../components/layout/Title";
import { TouchableOpacity } from "react-native-gesture-handler";
import Dialog from "../../../components/Dialog";

export default function GenerateScaleVacationList({ visible = false, hideModal = () => {}, navigation = () => {} }) {
    const [vacations, setVacations] = useState([]);
    const [showingDeleteDialog, setShowingDeleteDialog] = useState(false);
    const [employeeIdToDelete, setEmployeeIdToDelete] = useState(0);

    function deleteEmployeeVacation() {
        const generateScales = storage.getString("generate-scales");
        const generateScalesObj = generateScales ? JSON.parse(generateScales) : {};

        generateScalesObj.vacations = generateScalesObj.vacations.filter((d) => d.employee.id !== employeeIdToDelete);

        storage.set("generate-scales", JSON.stringify(generateScalesObj));

        setShowingDeleteDialog(false);
    }

    function fetchVacationToGenerateScales() {
        const generateScales = storage.getString("generate-scales");
        const generateScalesObj = generateScales ? JSON.parse(generateScales) : {};

        if (Object.keys(generateScalesObj).length === 0 || !generateScalesObj.vacations || generateScalesObj.vacations?.length === 0) {
            setVacations([]);

            return;
        }

        setVacations(generateScalesObj.vacations);
    }

    useEffect(() => {
        const listener = storage.addOnValueChangedListener((changedKey) => {
            if (changedKey === "generate-scales") {
                fetchVacationToGenerateScales();
            }
        });

        return () => listener.remove();
    }, []);

    useEffect(() => fetchVacationToGenerateScales(), []);

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hideModal}
                className="px-2"
                contentContainerStyle={{ backgroundColor: "#2a2a2e", padding: 20, borderRadius: 9 }}
            >
                <Title title="Férias" className="text-gray-400 mt-0" />

                <Button mode="elevated" onPress={() => navigation.navigate("VacationCreate")} className="mb-2">
                    Adicionar
                </Button>

                {vacations.length > 0 ? (
                    <View>
                        <FlatList
                            data={vacations}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="bg-default-3 pl-2.5 py-2 rounded-lg mb-2 whitespace-wrap text-wrap"
                                    activeOpacity={0.78}
                                    onLongPress={() => {
                                        setEmployeeIdToDelete(item.employee.id);
                                        setShowingDeleteDialog(true);
                                    }}
                                >
                                    <Text className="w-[30%] text-gray-200 truncate font-semibold">{item.employee.name}</Text>
                                    <Text className="text-gray-300">{`${item.startDate}  até  ${item.endDate}`}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.employee?.id ?? Math.random().toString()}
                        />

                        <Dialog
                            visible={showingDeleteDialog}
                            hideDialog={() => setShowingDeleteDialog(false)}
                            onConfirm={deleteEmployeeVacation}
                            message="Tem certeza que deseja excluir estas folgas?"
                        />
                    </View>
                ) : (
                    <Text className="text-gray-500 text-center">Nenhuma folga adicionada</Text>
                )}
            </Modal>
        </Portal>
    );
}
