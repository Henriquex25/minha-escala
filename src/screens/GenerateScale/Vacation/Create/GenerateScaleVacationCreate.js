import { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { Button, Divider, Searchbar, Menu, PaperProvider } from "react-native-paper";
import { storage } from "../../../../Storage";
import DateTimeInput from "../../../../components/form/DateTimeInput";
import Label from "../../../../components/Label";

export default function GenerateScaleVacationCreate({ navigation }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [employees, setEmployees] = useState([]);
    const [employeesFound, setEmployeesFound] = useState([]);
    const [employeeSelectedToAddVacation, setEmployeeSelectedToAddVacation] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showingDeleteDialog, setShowingDeleteDialog] = useState(false);
    const [vacationToBeRemovedCertificateToBeRemoved, setVacationToBeRemovedCertificateToBeRemoved] = useState(null);

    function getGenerateScale() {
        const existingGenerateScales = storage.getString("generate-scales");

        return existingGenerateScales ? JSON.parse(existingGenerateScales) : {};
    }

    function getVacationStartDateIfThereIsPreviousPreSelectedVacation(employeeId) {
        const generateScales = getGenerateScale();
        const employeeIndex = getIndexIfEmployeeAlreadyHasPreSelectedVacation(employeeId);

        if (employeeIndex > -1) {
            setStartDate(generateScales.vacations[employeeIndex].startDate);
            return;
        }
    }

    function getIndexIfEmployeeAlreadyHasPreSelectedVacation(employeeId = null) {
        const generateScales = getGenerateScale();
        return generateScales.vacations?.findIndex((d) => d.employee.id === (employeeId ? employeeId : employeeSelectedToAddVacation.id)) ?? -1;
    }

    function saveVacationToGenerateScale() {
        if (startDate.length === 0 || endDate.length === 0) {
            return;
        }

        const generateScales = getGenerateScale();
        const indexEmployeeToBeRemovedVacation = getIndexIfEmployeeAlreadyHasPreSelectedVacation();

        // Funcionário já possui dias de folga pre-selecionados
        if (indexEmployeeToBeRemovedVacation > -1) {
            generateScales.vacations[indexEmployeeToBeRemovedVacation].startDate = startDate;
            generateScales.vacations[indexEmployeeToBeRemovedVacation].endDate = endDate;

            storage.set("generate-scales", JSON.stringify(generateScales));
            navigation.goBack();
            return;
        }

        const payload = {
            employee: employeeSelectedToAddVacation,
            startDate: startDate,
            endDate: endDate,
        };

        if (generateScales.vacations?.length) {
            generateScales.vacations.push(payload);
        } else {
            generateScales.vacations = [payload];
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
                {Object.keys(employeeSelectedToAddVacation).length === 0 ? (
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
                                                setEmployeeSelectedToAddVacation(item);
                                                getVacationStartDateIfThereIsPreviousPreSelectedVacation(item.id);
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
                            <Text className="text-primary-400 font-semibold text-lg text-center">{employeeSelectedToAddVacation.name}</Text>
                        </View>

                        <Divider className="my-6 bg-primary-500/40" />

                        {/* Escolher Dias */}
                        <View>
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
                        </View>

                        {/* Lista de fol{/* Botão de salvar */}
                        <Button className="mt-7 bg-primary-500" mode="elevated" onPress={saveVacationToGenerateScale} textColor="black">
                            Salvar
                        </Button>
                    </View>
                )}
            </View>
        </PaperProvider>
    );
}
