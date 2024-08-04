import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Button, Divider, Searchbar, PaperProvider } from "react-native-paper";
import { storage } from "../../../../Storage";
import moment from "moment";
import Label from "../../../../components/Label";
import DateTimeInput from "../../../../components/form/DateTimeInput";

export default function GenerateScaleMedicalCertificateCreate({ navigation }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [employees, setEmployees] = useState([]);
    const [employeesFound, setEmployeesFound] = useState([]);
    const [employeeSelectedToAddMedicalCertificate, setEmployeeSelectedToAddMedicalCertificate] = useState({});
    const [medicalCertificatesSelected, setMedicalCertificatesSelected] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    function getGenerateScale() {
        const existingGenerateScales = storage.getString("generate-scales");

        return existingGenerateScales ? JSON.parse(existingGenerateScales) : {};
    }

    function getMedicalCertificatesIfTheEmployeeAlreadyHasPreviousMedicalCertificatesPreSelected(employeeId) {
        const generateScales = getGenerateScale();
        const employeeIndex = getIndexIfEmployeeAlreadyHasPreSelectedMedicalCertificate(employeeId);

        if (employeeIndex > -1) {
            setMedicalCertificatesSelected(generateScales.medicalCertificates[employeeIndex].dates);
            return;
        }

        setMedicalCertificatesSelected([]);
    }

    function getIndexIfEmployeeAlreadyHasPreSelectedMedicalCertificate(employeeId = null) {
        const generateScales = getGenerateScale();
        return (
            generateScales.medicalCertificates?.findIndex(
                (d) => d.employee.id === (employeeId ? employeeId : employeeSelectedToAddMedicalCertificate.id)
            ) ?? -1
        );
    }

    function setMedicalCertificate(event, selectedDate) {
        if (event.type === "dismissed") {
            setShowingDate(false);
            return;
        }

        const existingData = medicalCertificatesSelected.some((d) => moment(d).isSame(selectedDate));
        if (existingData) {
            setShowingDate(false);
            return;
        }

        setMedicalCertificatesSelected([...medicalCertificatesSelected, selectedDate]);

        setShowingDate(false);
    }

    function saveMedicalCertificates() {
        if (startDate.length === 0 || endDate.length === 0) {
            // TODO: Mostrar mensagem de erro de validação
            return;
        }

        const generateScales = getGenerateScale();
        const indexMedicalCertificates = getIndexIfEmployeeAlreadyHasPreSelectedMedicalCertificate();

        // Funcionário já possui atestado já inserido
        if (indexMedicalCertificates > -1) {
            generateScales.medicalCertificates[indexMedicalCertificates].startDate = startDate;
            generateScales.medicalCertificates[indexMedicalCertificates].endDate = endDate;

            storage.set("generate-scales", JSON.stringify(generateScales));
            navigation.goBack();
            return;
        }

        const payload = {
            employee: employeeSelectedToAddMedicalCertificate,
            startDate: moment(startDate).format("DD/MM/YYYY"),
            endDate: moment(endDate).format("DD/MM/YYYY"),
        };

        if (generateScales.medicalCertificates?.length) {
            generateScales.medicalCertificates.push(payload);
        } else {
            generateScales.medicalCertificates = [payload];
        }

        storage.set("generate-scales", JSON.stringify(generateScales));

        navigation.goBack();
    }

    function fetchEmployees() {
        const storedEmployees = storage.getString("employees");

        setEmployees(storedEmployees ? JSON.parse(storedEmployees) : []);
    }

    useEffect(() => fetchEmployees(), []);

    return (
        <PaperProvider>
            <View className="px-5 mt-3">
                {/* Buscar funcionário */}
                {Object.keys(employeeSelectedToAddMedicalCertificate).length === 0 ? (
                    <View>
                        <Searchbar
                            placeholder="Pesquisar funcionário"
                            className="mt-3 bg-default-3 text-gray-200 mb-3"
                            inputStyle={{ color: "#e5e7eb" }}
                            iconColor="#0ea5e9"
                            placeholderTextColor={"#9ca3af"}
                            value={searchQuery}
                            onChangeText={(query) => {
                                setSearchQuery(query);
                                setEmployeesFound(employees.filter((employee) => employee.name.toLowerCase().includes(query.toLowerCase())));
                            }}
                        />

                        {employeesFound.length > 0 ? (
                            <FlatList
                                data={employeesFound}
                                renderItem={({ item }) => (
                                    <View className="flex flex-row items-center justify-center px-2.5 mb-2">
                                        <Button
                                            mode="elevated"
                                            textColor="#0ea5e9"
                                            className="w-full bg-default-2"
                                            onPress={() => {
                                                setEmployeeSelectedToAddMedicalCertificate(item);
                                                getMedicalCertificatesIfTheEmployeeAlreadyHasPreviousMedicalCertificatesPreSelected(item.id);
                                                setSearchQuery("");
                                                setEmployeesFound([]);
                                            }}
                                        >
                                            {item.name}
                                        </Button>
                                    </View>
                                )}
                                keyExtractor={(item) => item.id}
                            />
                        ) : (
                            <View className="flex flex-row items-center bg-default-1 mx-2.5 px-3 py-2 rounded-lg mb-2">
                                <Text className="w-full text-gray-400 truncate text-center">Nenhum resultado encontrado</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View>
                        {/* Funcionário selecionado */}
                        <View className="relative">
                            <Text className="text-primary-400 font-semibold text-lg text-center">{employeeSelectedToAddMedicalCertificate.name}</Text>
                        </View>

                        <Divider className="my-6 bg-primary-500/40" />

                        {/* Data inicial */}
                        <View>
                            <Label label="Início" />
                            <DateTimeInput value={startDate} onValueChange={(value) => setStartDate(value)} />
                        </View>

                        {/* Data final */}
                        <View className="mt-5">
                            <Label label="Fim" />
                            <DateTimeInput value={endDate} onValueChange={(value) => setEndDate(value)} />
                        </View>

                        {/* Botão de salvar */}
                        <Button className="mt-7 bg-primary-500" mode="elevated" onPress={saveMedicalCertificates} textColor="black">
                            Salvar
                        </Button>
                    </View>
                )}
            </View>
        </PaperProvider>
    );
}
