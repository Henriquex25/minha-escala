import { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { Portal, Modal, Button } from "react-native-paper";
import { storage } from "../../../Storage";
import moment from "moment";
import Title from "../../../components/layout/Title";
import { TouchableOpacity } from "react-native-gesture-handler";
import Dialog from "../../../components/Dialog";

export default function GenerateScaleMedicalCertificateList({ visible = false, hideModal = () => {}, navigation = () => {} }) {
    const [medicalCertificates, setMedicalCertificates] = useState([]);
    const [showingDeleteDialog, setShowingDeleteDialog] = useState(false);
    const [employeeIdToDelete, setEmployeeIdToDelete] = useState(0);

    function deleteEmployeeMedicalCertificates() {
        const generateScales = storage.getString("generate-scales");
        const generateScalesObj = generateScales ? JSON.parse(generateScales) : {};

        generateScalesObj.medicalCertificates = generateScalesObj.medicalCertificates.filter((d) => d.employee.id !== employeeIdToDelete);

        storage.set("generate-scales", JSON.stringify(generateScalesObj));

        setShowingDeleteDialog(false);
    }

    function plainTextDates(dts) {
        return dts.map((d) => moment(d).format("DD/MM/YYYY")).join(", ");
    }

    function fetchMedicalCertificatesToGenerateScales() {
        const generateScales = storage.getString("generate-scales");
        const generateScalesObs = generateScales ? JSON.parse(generateScales) : {};

        if (
            Object.keys(generateScalesObs).length === 0 ||
            !generateScalesObs.medicalCertificates ||
            generateScalesObs.medicalCertificates?.length === 0
        ) {
            setMedicalCertificates([]);

            return;
        }

        setMedicalCertificates(generateScalesObs.medicalCertificates);
    }

    useEffect(() => {
        const listener = storage.addOnValueChangedListener((changedKey) => {
            if (changedKey === "generate-scales") {
                fetchMedicalCertificatesToGenerateScales();
            }
        });

        return () => listener.remove();
    }, []);

    useEffect(() => fetchMedicalCertificatesToGenerateScales(), []);

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hideModal}
                className="px-2"
                contentContainerStyle={{ backgroundColor: "#2a2a2e", padding: 20, borderRadius: 9 }}
            >
                <Title title="Atestados" className="text-gray-400 mt-0" />

                <Button mode="elevated" onPress={() => navigation.navigate("MedicalCertificatesCreate")} className="mb-2">
                    Adicionar
                </Button>

                {medicalCertificates.length > 0 ? (
                    <View>
                        <FlatList
                            data={medicalCertificates}
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
                                    <Text className="text-gray-300">{plainTextDates(item.dates)}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.employee?.id ?? Math.random().toString()}
                        />

                        <Dialog
                            visible={showingDeleteDialog}
                            hideDialog={() => setShowingDeleteDialog(false)}
                            onConfirm={deleteEmployeeMedicalCertificates}
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
