import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Button, Divider, Searchbar, Menu, PaperProvider } from "react-native-paper";
import { storage } from "../../../../Storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Dialog from "../../../../components/Dialog";

export default function GenerateScaleVacationCreate({ navigation }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [employees, setEmployees] = useState([]);
    const [employeesFound, setEmployeesFound] = useState([]);
    const [employeeSelectedToAddVacation, setEmployeeSelectedToAddvacationToBeRemovedCertificate] = useState({});
    const [showingDate, setShowingDate] = useState(false);
    const [VacationSelected, setVacationSelected] = useState([]);
    const [showingDeleteDialog, setShowingDeleteDialog] = useState(false);
    const [vacationToBeRemovedCertificateToBeRemoved, setvacationToBeRemovedCertificateToBeRemoved] = useState(null);

    function getGenerateScale() {
        const existingGenerateScales = storage.getString("generate-scales");

        return existingGenerateScales ? JSON.parse(existingGenerateScales) : {};
    }

    function getvacationToBeRemovedCertificatesIfTheEmployeeAlreadyHasPreviousvacationToBeRemovedCertificatesPreSelected(employeeId) {
        const generateScales = getGenerateScale();
        const employeeIndex = getIndexIfEmployeeAlreadyHasPreSelectedVacation(employeeId);

        if (employeeIndex > -1) {
            setVacationSelected(generateScales.vacation[employeeIndex].dates);
            return;
        }

        setVacationSelected([]);
    }

    function getIndexIfEmployeeAlreadyHasPreSelectedVacation(employeeId = null) {
        const generateScales = getGenerateScale();
        return generateScales.vacation?.findIndex((d) => d.employee.id === (employeeId ? employeeId : employeeSelectedToAddVacation.id)) ?? -1;
    }

    function setvacationToBeRemovedCertificate(event, selectedDate) {
        if (event.type === "dismissed") {
            setShowingDate(false);
            return;
        }

        const existingData = VacationSelected.some((d) => moment(d).isSame(selectedDate));
        if (existingData) {
            setShowingDate(false);
            return;
        }

        setVacationSelected([...VacationSelected, selectedDate]);

        setShowingDate(false);
    }

    function savevacationToBeRemovedCertificates() {
        if (VacationSelected.length === 0) {
            navigation.goBack();
            return;
        }

        const generateScales = getGenerateScale();
        const indexvacationToBeRemovedCertificates = getIndexIfEmployeeAlreadyHasPreSelectedVacation();

        // Funcionário já possui dias de folga pre-selecionados
        if (indexvacationToBeRemovedCertificates > -1) {
            generateScales.vacation[indexvacationToBeRemovedCertificates].dates = [...VacationSelected];

            storage.set("generate-scales", JSON.stringify(generateScales));
            navigation.goBack();
            return;
        }

        const payload = {
            employee: employeeSelectedToAddVacation,
            dates: VacationSelected,
        };

        if (generateScales.vacation?.length) {
            generateScales.vacation.push(payload);
        } else {
            generateScales.vacation = [payload];
        }

        console.log("generateScales", generateScales, "stringify", JSON.stringify(generateScales));
        storage.set("generate-scales", JSON.stringify(generateScales));

        navigation.goBack();
    }

    function removeVacation() {
        if (!vacationToBeRemovedCertificateToBeRemoved) return;

        setVacationSelected(VacationSelected.filter((d) => !moment(d).isSame(vacationToBeRemovedCertificateToBeRemoved)));

        setShowingDeleteDialog(false);
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
                                                setEmployeeSelectedToAddvacationToBeRemovedCertificate(item);
                                                getvacationToBeRemovedCertificatesIfTheEmployeeAlreadyHasPreviousvacationToBeRemovedCertificatesPreSelected(
                                                    item.id
                                                );
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

                        {/* Dias */}
                        <View>
                            <TouchableOpacity className="w-full" activeOpacity={0.78} onPress={() => setShowingDate(true)}>
                                <Text className="text-center text-primary-500 font-semibold mb-6">ESCOLHER DATA</Text>
                            </TouchableOpacity>
                        </View>

                        {showingDate && <DateTimePicker value={new Date()} mode="date" onChange={setvacationToBeRemovedCertificate} />}

                        {/* Lista de folgas escolhidas */}
                        {VacationSelected.length > 0 && (
                            <View>
                                <FlatList
                                    data={VacationSelected}
                                    renderItem={({ item }) => (
                                        <View>
                                            <TouchableOpacity
                                                className="bg-default-2 mb-2 py-2.5 rounded-lg"
                                                onLongPress={() => {
                                                    setvacationToBeRemovedCertificateToBeRemoved(item);
                                                    setShowingDeleteDialog(true);
                                                }}
                                                activeOpacity={0.78}
                                            >
                                                <Text className="text-primary-400 font-semibold text-center">
                                                    {moment(item).format("DD/MM/YYYY")}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />

                                {/* Botão de salvar */}
                                <Button
                                    className="mt-6 bg-primary-500"
                                    mode="elevated"
                                    onPress={savevacationToBeRemovedCertificates}
                                    textColor="black"
                                >
                                    Salvar
                                </Button>

                                {/* Dialog de confirmação de exclusão */}
                                <Dialog
                                    visible={showingDeleteDialog}
                                    hideDialog={() => setShowingDeleteDialog(false)}
                                    onConfirm={removeVacation}
                                    message="Tem certeza que deseja excluir esta folga?"
                                />
                            </View>
                        )}
                    </View>
                )}
            </View>
        </PaperProvider>
    );
}
