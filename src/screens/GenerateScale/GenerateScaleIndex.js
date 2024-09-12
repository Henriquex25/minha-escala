import { ScrollView, StatusBar, View, Platform, ToastAndroid } from "react-native";
import Body from "../../components/layout/Body";
import DateTimeInput from "../../components/form/DateTimeInput";
import { SegmentedButtons, Button } from "react-native-paper";
import { useState } from "react";
import Title from "../../components/layout/Title";
import Label from "../../components/Label";
import GenerateScaleDaysOffList from "./DaysOff/GenerateScaleDaysOffList";
import GenerateScaleMedicalCertificateList from "./MedicalCertificate/GenerateScaleMedicalCertificateList";
import GenerateScaleVacationList from "./Vacation/GenerateScaleVacationList";
import Dialog from "../../components/Dialog";
import ActivityIndicator from "../../components/ActivityIndicator";
import { storage } from "../../Storage";
import moment from "moment";

export default function GenerateScaleIndex({ navigation }) {
    const [sequenceDays, setSequenceDays] = useState("odd");
    const [showingDaysOffModal, setShowingDaysOffModal] = useState(false);
    const [showingMedicalCertificateModal, setShowingMedicalCertificateModal] = useState(false);
    const [showingVacationModal, setShowingVacationModal] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showScaleGenerationDialog, setShowScaleGenerationDialog] = useState(false);
    const [showActivityIndicator, setShowActivityIndicator] = useState(false);

    const scaleGenerationPopulationOrder = [
        getObservationEmployees,
        getFastCLMEmployees,
        // getFastMedicationEmployees,
        // getFastCollectEmployees,
        getConciergeEmployees,
        getMedicalSupportEmployees,
        getReceptionCEmployees,
        getReceptionGEmployees,
    ];

    function handleGenerateScale() {
        setShowScaleGenerationDialog(false);
        setShowActivityIndicator(true);

        setTimeout(() => {
            generateScale();

            setShowActivityIndicator(false);

            if (Platform.OS === "android") {
                ToastAndroid.show("Escalas geradas com sucesso ✓", ToastAndroid.SHORT);
            }
        }, 0);
    }

    function generateScale() {
        const scales = [];
        const scaleGenerationData = getScaleGenerationData();
        const dates = generateDates();

        storage.set(
            "generate-scales",
            JSON.stringify({
                daysOff: [],
                medicalCertificates: [],
                vacations: [],
            })
        );

        dates.forEach((date) => {
            let histories = getHistories();
            let availableEmployees = JSON.parse(storage.getString("employees") ?? "[]");
            let employeesOnLeave = availableEmployees.filter((e) =>
                scaleGenerationData.daysOff?.some(
                    (d) => d.employee.id === e.id && d.dates?.some((dayOff) => dayOff === date)
                )
            );
            let employeesMedicalCertificates = availableEmployees.filter((e) =>
                scaleGenerationData.medicalCertificates?.some((mc) => {
                    const dateOfTheScaleBeingGenerated = moment(date, "DD/MM/YYYY");
                    const startDate = moment(mc.startDate, "DD/MM/YYYY");
                    const endDate = moment(mc.endDate, "DD/MM/YYYY");

                    return (
                        mc.employee.id === e.id &&
                        dateOfTheScaleBeingGenerated.isSameOrAfter(startDate) &&
                        dateOfTheScaleBeingGenerated.isSameOrBefore(endDate)
                    );
                })
            );
            let employeesVacations = availableEmployees.filter((e) =>
                scaleGenerationData.vacations?.some((v) => {
                    const dateOfTheScaleBeingGenerated = moment(date, "DD/MM/YYYY");
                    const startDate = moment(v.startDate, "DD/MM/YYYY");
                    const endDate = moment(v.endDate, "DD/MM/YYYY");

                    return (
                        v.employee.id === e.id &&
                        dateOfTheScaleBeingGenerated.isSameOrAfter(startDate) &&
                        dateOfTheScaleBeingGenerated.isSameOrBefore(endDate)
                    );
                })
            );
            let scale = { date: date };

            scale.daysOff = employeesOnLeave;
            scale.medicalCertificates = employeesMedicalCertificates;
            scale.vacations = employeesVacations;
            scale.availableEmployees = availableEmployees.filter(
                (e) =>
                    !employeesOnLeave.some((el) => el.id === e.id) &&
                    !employeesVacations.some((el) => el.id === e.id) &&
                    !employeesMedicalCertificates.some((el) => el.id === e.id)
            );

            for (let i = 0; i < scaleGenerationPopulationOrder.length; i++) {
                const getSectorEmployees = scaleGenerationPopulationOrder[i];
                const [sca, his] = getSectorEmployees(scale, date, histories);

                scale = sca;
                histories = his;
            }

            scales.push(scale);
            storage.set("histories", JSON.stringify(histories));
        });

        saveScalesDB(scales);
        storage.set(
            "generate-scales",
            JSON.stringify({
                daysOff: [],
                medicalCertificates: [],
                vacations: [],
            })
        );
    }

    function getScaleGenerationData() {
        const generateScales = storage.getString("generate-scales");

        return generateScales ? JSON.parse(generateScales) : {};
    }

    function getScales() {
        const scales = storage.getString("scales");

        return scales ? JSON.parse(scales) : [];
    }

    function saveScalesDB(scales) {
        let scalesDB = getScales();

        scalesDB = [...scalesDB, ...scales];

        scalesDB.sort(
            (a, b) => moment(a.date, "DD/MM/YYYY").toDate() - moment(b.date, "DD/MM/YYYY").toDate()
        );

        storage.set("scales", JSON.stringify(scalesDB));
    }

    function getHistories() {
        const histories = storage.getString("histories");

        return histories ? JSON.parse(histories) : [];
    }

    function generateDates() {
        const start = moment(startDate);
        const end = moment(endDate);
        let dates = [];

        for (let date = start; date.isSameOrBefore(end); date.add(1, "days")) {
            const day = date.date();
            if (sequenceDays === "even" ? day % 2 === 0 : day % 2 !== 0) {
                dates.push(date.format("DD/MM/YYYY"));
            }
        }

        return dates;
    }

    function getObservationEmployees(scale, date, histories) {
        const sectorId = "observation";
        const sectorName = "Observação";
        const maxNumberEmployeesForTheSector = 1;
        const [selectedEmployees, his] = chooseEmployee(
            sectorId,
            sectorName,
            maxNumberEmployeesForTheSector,
            scale,
            histories,
            date
        );

        scale[sectorId] = selectedEmployees;

        scale.availableEmployees = scale.availableEmployees.filter(
            (employee) => !selectedEmployees.some((e) => e.id === employee.id)
        );

        return [scale, his];
    }

    function getFastCLMEmployees(scale, date, histories) {
        const sectorId = "fastCLM";
        const sectorName = "Fast CLM";
        const maxNumberEmployeesForTheSector = 1;
        const employeesMedicalSupport = scale.availableEmployees.filter(
            (employee) => employee.sectors?.medicalSupport === true
        );

        // Pula etapa de escolha de funcionário caso tenha 2 ou menos funcionários do apoio
        if (employeesMedicalSupport.length <= 2) {
            scale[sectorId] = [];

            return [scale, histories];
        }

        const [selectedEmployees, his] = chooseEmployee(
            sectorId,
            sectorName,
            maxNumberEmployeesForTheSector,
            scale,
            histories,
            date
        );

        scale[sectorId] = selectedEmployees;

        scale.availableEmployees = scale.availableEmployees.filter(
            (employee) => !selectedEmployees.some((e) => e.id === employee.id)
        );

        return [scale, his];
    }

    function getFastMedicationEmployees(scale, date, histories) {
        const sectorId = "fastMedication";
        const sectorName = "Fast medicação";
        const maxNumberEmployeesForTheSector = 1;
        const [selectedEmployees, his] = chooseEmployee(
            sectorId,
            sectorName,
            maxNumberEmployeesForTheSector,
            scale,
            histories,
            date
        );

        scale[sectorId] = selectedEmployees;

        scale.availableEmployees = scale.availableEmployees.filter(
            (employee) => !selectedEmployees.some((e) => e.id === employee.id)
        );

        return [scale, his];
    }

    function getFastCollectEmployees(scale, date, histories) {
        const sectorId = "fastCollect";
        const sectorName = "Fast coleta";
        const maxNumberEmployeesForTheSector = 1;
        let selectedEmployees = [];
        let hist = histories;

        const preferredEmployeeForSector = scale.availableEmployees.find(
            (e) => e.name.toLowerCase().trim() === "Kaique".toLowerCase().trim()
        );

        if (preferredEmployeeForSector) {
            const sectorHistoryIndex = histories.findIndex((h) => h.id === sectorId);
            const sectorHistory =
                sectorHistoryIndex > -1
                    ? histories[sectorHistoryIndex]
                    : {
                          id: sectorId,
                          name: sectorName,
                          employees: [],
                      };

            selectedEmployees = [
                {
                    id: preferredEmployeeForSector.id,
                    name: preferredEmployeeForSector.name,
                    lastDate: date,
                },
            ];

            hist = updatePartialHistory(
                histories,
                sectorHistoryIndex,
                sectorHistory,
                preferredEmployeeForSector,
                date
            );
        } else {
            const [selEmployees, his] = chooseEmployee(
                sectorId,
                sectorName,
                maxNumberEmployeesForTheSector,
                scale,
                histories,
                date
            );

            selectedEmployees = selEmployees;
            hist = his;
        }

        scale[sectorId] = selectedEmployees;

        scale.availableEmployees = scale.availableEmployees.filter(
            (employee) => !selectedEmployees.some((e) => e.id === employee.id)
        );

        return [scale, hist];
    }

    function getConciergeEmployees(scale, date, histories) {
        const sectorId = "concierge";
        const sectorName = "Concierge";
        const maxNumberEmployeesForTheSector = 1;
        const employeesMedicalSupport = scale.availableEmployees.filter(
            (employee) => employee.sectors?.medicalSupport === true
        );
        let selectedEmployees = [];
        let hist = histories;

        // Pula etapa de escolha de funcionário caso tenha 2 ou menos funcionários do apoio
        if (employeesMedicalSupport.length <= 2) {
            scale[sectorId] = selectedEmployees;

            return [scale, histories];
        }

        const preferredEmployeeForSector = scale.availableEmployees.find(
            (e) => e.name.toLowerCase().trim() === "Thatianny".toLowerCase().trim()
        );

        if (preferredEmployeeForSector) {
            const sectorHistoryIndex = histories.findIndex((h) => h.id === sectorId);
            const sectorHistory =
                sectorHistoryIndex > -1
                    ? histories[sectorHistoryIndex]
                    : {
                          id: sectorId,
                          name: sectorName,
                          employees: [],
                      };

            selectedEmployees = [
                {
                    id: preferredEmployeeForSector.id,
                    name: preferredEmployeeForSector.name,
                    lastDate: date,
                },
            ];

            hist = updatePartialHistory(
                histories,
                sectorHistoryIndex,
                sectorHistory,
                preferredEmployeeForSector,
                date
            );
        } else {
            const [selEmployees, his] = chooseEmployee(
                sectorId,
                sectorName,
                maxNumberEmployeesForTheSector,
                scale,
                histories,
                date
            );

            selectedEmployees = selEmployees;
            hist = his;
        }

        scale[sectorId] = selectedEmployees;

        scale.availableEmployees = scale.availableEmployees.filter(
            (employee) => !selectedEmployees.some((e) => e.id === employee.id)
        );

        return [scale, hist];
    }

    function getMedicalSupportEmployees(scale, date, histories) {
        const sectorId = "medicalSupport";
        const sectorName = "Apoio médico";
        const maxNumberEmployeesForTheSector = 2;
        const [selectedEmployees, his] = chooseEmployee(
            sectorId,
            sectorName,
            maxNumberEmployeesForTheSector,
            scale,
            histories,
            date
        );

        scale[sectorId] = selectedEmployees;

        scale.availableEmployees = scale.availableEmployees.filter(
            (employee) => !selectedEmployees.some((e) => e.id === employee.id)
        );

        return [scale, his];
    }

    function getReceptionCEmployees(scale, date, histories) {
        const sectorId = "receptionC";
        const sectorName = "Recepção bloco C";
        const maxNumberEmployeesForTheSector = 1;
        const [selectedEmployees, his] = chooseEmployee(
            sectorId,
            sectorName,
            maxNumberEmployeesForTheSector,
            scale,
            histories,
            date
        );

        scale[sectorId] = selectedEmployees;

        scale.availableEmployees = scale.availableEmployees.filter(
            (employee) => !selectedEmployees.some((e) => e.id === employee.id)
        );

        return [scale, his];
    }

    function getReceptionGEmployees(scale, date, histories) {
        const sectorId = "receptionG";
        const sectorName = "Recepção bloco G";
        const maxNumberEmployeesForTheSector = 0;
        const [selectedEmployees, his] = chooseEmployee(
            sectorId,
            sectorName,
            maxNumberEmployeesForTheSector,
            scale,
            histories,
            date
        );

        scale[sectorId] = selectedEmployees;

        scale.availableEmployees = scale.availableEmployees.filter(
            (employee) => !selectedEmployees.some((e) => e.id === employee.id)
        );

        return [scale, his];
    }

    function chooseEmployee(
        sectorId,
        sectorName,
        maxNumberEmployeesForTheSector,
        scale,
        histories,
        date
    ) {
        let updatedHistories = histories;
        const selectedEmployees = [];
        const sectorHistoryIndex = updatedHistories.findIndex((h) => h.id === sectorId);
        const sectorHistory =
            sectorHistoryIndex > -1
                ? updatedHistories[sectorHistoryIndex]
                : {
                      id: sectorId,
                      name: sectorName,
                      employees: [],
                  };

        // Busca os funcionários habilitados para o setor
        let employeesAvailableForTheSector = scale.availableEmployees.filter(
            (employee) => employee.sectors[sectorId] === true
        );

        // Caso não tenha nenhum funcionário habilitado, retorna um array vazio
        if (employeesAvailableForTheSector.length === 0) {
            return [selectedEmployees, histories];
        }

        // Se o número máximo de funcionários por setor for igual a 0, significa que não tem limite de funcionários por setor
        // logo todos os funcionários disponíveis serão selecionados
        if (maxNumberEmployeesForTheSector === 0) {
            maxNumberEmployeesForTheSector = employeesAvailableForTheSector.length;
        }

        // Coloca no histórico todos os funcionários que estão aptos para o setor, mas não tem histórico anterior
        // fora do histórico, nunca serão selecionados, pois a escolhe é para o funcionário que tem o maior tempo
        // desde a última vez que ficou no setor
        employeesAvailableForTheSector.forEach((employee) => {
            if (!sectorHistory.employees.some((e) => e.id === employee.id)) {
                sectorHistory.employees.push({
                    id: employee.id,
                    name: employee.name,
                    lastDate: null,
                });
            }
        });

        // Remove os funcionários que estão no histórico do setor, porém foram desabilitados para continuar no setor
        sectorHistory.employees = sectorHistory.employees.filter((employee) => {
            const emp = JSON.parse(storage.getString("employees") ?? "[]").find(
                (e) => e.id === employee.id
            );

            return emp.sectors[sectorId] === true;
        });

        for (let i = 0; i < maxNumberEmployeesForTheSector; i++) {
            // Busca o primeiro funcionário do histórico que esteja na lista de funcionários disponíveis
            let employeeLastSeenInTheFurthestSector = sectorHistory.employees.find((e) =>
                employeesAvailableForTheSector.some(
                    (e2) => e2.id === e.id && !selectedEmployees.some((e3) => e3.id === e2.id)
                )
            );

            // Caso não encontre nenhum usuário disponível no histórico, o primeiro usuário disponíveis será selecionado
            // e retirado da lista lista de funcionários disponíveis para que não seja selecionado novamente no próximo loop
            if (!employeeLastSeenInTheFurthestSector) {
                employeeLastSeenInTheFurthestSector = employeesAvailableForTheSector[0];

                employeesAvailableForTheSector = employeesAvailableForTheSector.filter(
                    (employee) => employee.id !== employeeLastSeenInTheFurthestSector.id
                );
            }

            selectedEmployees.push(employeeLastSeenInTheFurthestSector);

            employeesAvailableForTheSector = employeesAvailableForTheSector.filter(
                (employee) => employee.id !== employeeLastSeenInTheFurthestSector.id
            );

            updatedHistories = updatePartialHistory(
                histories,
                sectorHistoryIndex,
                sectorHistory,
                employeeLastSeenInTheFurthestSector,
                date
            );
        }

        return [selectedEmployees, updatedHistories];
    }

    function updatePartialHistory(
        histories,
        sectorHistoryIndex,
        sectorHistory,
        selectedEmployee,
        date
    ) {
        // Remove o funcionário da lista do histórico
        sectorHistory.employees = sectorHistory.employees.filter(
            (employee) => employee.id !== selectedEmployee.id
        );

        // Adiciona funcionário escolhido no fim (por último) do histórico
        sectorHistory.employees.push({
            id: selectedEmployee.id,
            name: selectedEmployee.name,
            lastDate: date,
        });

        histories[sectorHistoryIndex] = sectorHistory;

        return histories;
    }

    return (
        <Body>
            <StatusBar barStyle="light-content" backgroundColor="#2a2a2e" />
            <ActivityIndicator visible={showActivityIndicator} />
            <ScrollView>
                {/* Header */}
                <View className="mb-2">
                    <Title title="Gerar Escala" />
                </View>

                {/* Dê */}
                <View className="mb-4">
                    <Label label="Dê" />
                    <DateTimeInput
                        date={startDate}
                        setDate={setStartDate}
                        minimumDate={new Date()}
                        onValueChange={(value, event) => {
                            if (moment(value).isAfter(endDate)) {
                                setEndDate(value);
                            }
                        }}
                    />
                </View>

                {/* Até */}
                <View className="mb-4">
                    <Label label="Até" />
                    <DateTimeInput date={endDate} setDate={setEndDate} minimumDate={startDate} />
                </View>

                {/* Dias */}
                <View>
                    <Label label="Dias" />
                    <View className="px-1">
                        <SegmentedButtons
                            value={sequenceDays}
                            onValueChange={setSequenceDays}
                            buttons={[
                                {
                                    value: "odd",
                                    label: "Ímpares",
                                },
                                {
                                    value: "even",
                                    label: "Pares",
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* Folgas */}
                <View className="mt-5">
                    <Button
                        icon="calendar-month-outline"
                        mode="elevated"
                        onPress={() => setShowingDaysOffModal(true)}
                    >
                        Folgas
                    </Button>
                </View>

                {/* Atestados */}
                <View className="mt-5">
                    <Button
                        icon="hospital-box-outline"
                        mode="elevated"
                        onPress={() => setShowingMedicalCertificateModal(true)}
                    >
                        Atestados
                    </Button>
                </View>

                {/* Férias */}
                <View className="mt-5">
                    <Button
                        icon="hospital-box-outline"
                        mode="elevated"
                        onPress={() => setShowingVacationModal(true)}
                    >
                        Férias
                    </Button>
                </View>
            </ScrollView>

            {/* Botão de gerar */}
            <View className="mt-5 mb-2.5">
                <Button
                    icon="refresh"
                    mode="contained"
                    onPress={() => setShowScaleGenerationDialog(true)}
                >
                    Gerar escalas
                </Button>
            </View>

            {/* Modais */}
            <GenerateScaleDaysOffList
                visible={showingDaysOffModal}
                hideModal={() => setShowingDaysOffModal(false)}
                navigation={navigation}
            />

            <GenerateScaleMedicalCertificateList
                visible={showingMedicalCertificateModal}
                hideModal={() => setShowingMedicalCertificateModal(false)}
                navigation={navigation}
            />

            <GenerateScaleVacationList
                visible={showingVacationModal}
                hideModal={() => setShowingVacationModal(false)}
                navigation={navigation}
            />

            <Dialog
                visible={showScaleGenerationDialog}
                hideDialog={() => setShowScaleGenerationDialog(false)}
                onConfirm={handleGenerateScale}
            />
        </Body>
    );
}
