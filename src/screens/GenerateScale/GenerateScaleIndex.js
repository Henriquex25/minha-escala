import { ScrollView, StatusBar, View } from "react-native";
import Body from "../../components/layout/Body";
import DateTimeInput from "../../components/form/DateTimeInput";
import { SegmentedButtons, Button } from "react-native-paper";
import { useState, useEffect } from "react";
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
        getFastMedicationEmployees,
        getFastCollectEmployees,
        getConciergeEmployees,
        getMedicalSupportEmployees,
        getReceptionCEmployees,
        getReceptionGEmployees,
    ];

    function generateScale() {
        setShowActivityIndicator(true);

        const scales = [];
        const scaleGenerationData = getScaleGenerationData();
        const dates = generateDates();

        if (Object.keys(scaleGenerationData).length === 0) {
            // TODO: Mostrar erros de validação
            return;
        }

        dates.forEach((date) => {
            let scale = { date: date };

            for (let i = 0; i < scaleGenerationPopulationOrder.length; i++) {
                const availableEmployees = JSON.parse(storage.getString("employees") ?? [])
                    .filter((e) => !scaleGenerationData.daysOff.some((d) => d.employee.id === e.id && d.dates.some((dayOff) => dayOff === date)))
                    .filter(
                        (e) =>
                            !scaleGenerationData.medicalCertificates.some(
                                (mc) => mc.employee.id === e.id && mc.dates.some((dayOff) => dayOff === date)
                            )
                    )
                    .filter(
                        (e) =>
                            !scaleGenerationData.vacations.some((v) => {
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

                const getSectorEmployees = scaleGenerationPopulationOrder[i];

                console.log(availableEmployees);
                scale = getSectorEmployees(scale, date, scaleGenerationData);
            }

            scales.push(scale);
        });

        setShowActivityIndicator(false);
        setShowScaleGenerationDialog(false);
    }

    function getScaleGenerationData() {
        const generateScales = storage.getString("generate-scales");

        return generateScales ? JSON.parse(generateScales) : {};
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

    function getObservationEmployees(scale, date, availableEmployees) {
        return scale;
    }

    function getFastCLMEmployees(scale) {
        scale.fastCLM = { name: "Ciclano" };

        return scale;
    }

    function getFastMedicationEmployees(scale) {
        return scale;
    }

    function getFastCollectEmployees(scale) {
        return scale;
    }

    function getConciergeEmployees(scale) {
        return scale;
    }

    function getMedicalSupportEmployees(scale) {
        return scale;
    }

    function getReceptionCEmployees(scale) {
        return scale;
    }

    function getReceptionGEmployees(scale) {
        return scale;
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
                    <DateTimeInput value={startDate} onValueChange={setStartDate} />
                </View>

                {/* Até */}
                <View className="mb-4">
                    <Label label="Até" />
                    <DateTimeInput value={endDate} onValueChange={setEndDate} />
                </View>

                {/* Dias */}
                <View>
                    <Label label="Dias" />
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

                {/* Folgas */}
                <View className="mt-5">
                    <Button icon="calendar-month-outline" mode="elevated" onPress={() => setShowingDaysOffModal(true)}>
                        Folgas
                    </Button>
                </View>

                {/* Atestados */}
                <View className="mt-5">
                    <Button icon="hospital-box-outline" mode="elevated" onPress={() => setShowingMedicalCertificateModal(true)}>
                        Atestados
                    </Button>
                </View>

                {/* Férias */}
                <View className="mt-5">
                    <Button icon="hospital-box-outline" mode="elevated" onPress={() => setShowingVacationModal(true)}>
                        Férias
                    </Button>
                </View>
            </ScrollView>

            {/* Botão de gerar */}
            <View className="mt-5 mb-2.5">
                <Button icon="refresh" mode="contained" onPress={() => setShowScaleGenerationDialog(true)}>
                    Gerar escalas
                </Button>
            </View>

            {/* Modais */}
            <GenerateScaleDaysOffList visible={showingDaysOffModal} hideModal={() => setShowingDaysOffModal(false)} navigation={navigation} />
            <GenerateScaleMedicalCertificateList
                visible={showingMedicalCertificateModal}
                hideModal={() => setShowingMedicalCertificateModal(false)}
                navigation={navigation}
            />
            <GenerateScaleVacationList visible={showingVacationModal} hideModal={() => setShowingVacationModal(false)} navigation={navigation} />

            <Dialog visible={showScaleGenerationDialog} hideDialog={() => setShowScaleGenerationDialog(false)} onConfirm={generateScale} />
        </Body>
    );
}
