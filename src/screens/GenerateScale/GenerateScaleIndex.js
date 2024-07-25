import { ScrollView, StatusBar, View } from "react-native";
import Body from "../../components/layout/Body";
import DateTimeInput from "../../components/form/DateTimeInput";
import { SegmentedButtons, Button } from "react-native-paper";
import { useState } from "react";
import Title from "../../components/layout/Title";
import Label from "../../components/Label";
import GenerateScaleDaysOffList from "./DaysOff/GenerateScaleDaysOffList";

export default function GenerateScaleIndex({ navigation }) {
    const [sequenceDays, setSequenceDays] = useState("odd");
    const [showingDaysOffModal, setShowingDaysOffModal] = useState(false);
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(new Date());

    function showDaysOffModal() {
        setShowingDaysOffModal(true);
    }

    function hideDaysOffModal() {
        setShowingDaysOffModal(false);
    }

    return (
        <Body>
            <StatusBar barStyle="light-content" backgroundColor="#2a2a2e" />
            <ScrollView>
                {/* Header */}
                <View className="mb-2">
                    <Title title="Gerar Escala" />
                </View>

                {/* Dê */}
                <View className="mb-4">
                    <Label label="Dê" />
                    <DateTimeInput value={initialDate} onValueChange={setInitialDate} />
                </View>

                {/* Até */}
                <View className="mb-4">
                    <Label label="Até" />
                    <DateTimeInput value={finalDate} onValueChange={setFinalDate} />
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
                    <Button icon="calendar-month-outline" mode="elevated" onPress={showDaysOffModal}>
                        Folgas
                    </Button>
                </View>

                {/* Atestados */}
                <View className="mt-5">
                    <Button icon="hospital-box-outline" mode="elevated" onPress={() => console.log("Pressed")}>
                        Atestados
                    </Button>
                </View>

                {/* Férias */}
                <View className="mt-5">
                    <Button icon="hospital-box-outline" mode="elevated" onPress={() => console.log("Pressed")}>
                        Férias
                    </Button>
                </View>
            </ScrollView>

            {/* Botão de gerar */}
            <View className="mt-5 mb-2.5">
                <Button icon="refresh" mode="contained" onPress={() => console.log("Pressed")}>
                    Gerar escalas
                </Button>
            </View>

            <GenerateScaleDaysOffList visible={showingDaysOffModal} hideModal={hideDaysOffModal} navigation={navigation} />
        </Body>
    );
}
