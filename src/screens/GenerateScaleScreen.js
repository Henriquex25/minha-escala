import { Text, View } from "react-native";
import Body from "../components/layout/Body";
import DateTimeInput from "../components/form/DateTimeInput";
import { globalStyle } from "../globalStyle";
import Select from "../components/form/Select";
import { SegmentedButtons } from "react-native-paper";
import { useState } from "react";
import Title from "../components/layout/Title";
import Label from "../components/Label";

export default function GenerateScaleScreen() {
    const [sequenceDays, setSequenceDays] = useState("odd");

    return (
        <Body>
            <View>
                {/* Header */}
                <View className="mb-3.5">
                    <Title title="Gerar Escala" />
                </View>

                {/* Dê */}
                <View className="mb-4">
                    <DateTimeInput label="Dê" />
                </View>

                {/* Até */}
                <View className="mb-4">
                    <DateTimeInput label="Até" />
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
                                label: "Ímpar",
                            },
                            {
                                value: "even",
                                label: "Par",
                            },
                        ]}
                    />
                </View>
            </View>
        </Body>
    );
}
