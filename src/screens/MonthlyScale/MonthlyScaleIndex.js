import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import Body from "../../components/layout/Body";
import Title from "../../components/layout/Title";
import { Icon } from "react-native-paper";

export default function MonthlyScaleIndex({ navigation }) {
    return (
        <Body>
            <StatusBar barStyle="light-content" backgroundColor="#2a2a2e" />

            <Title title="Escala Mensal" />

            <View className="flex flex-row justify-between items-center mt-3">
                <TouchableOpacity className="p-2">
                    <Icon source="chevron-left" size={30} color="gray" />
                </TouchableOpacity>

                <Text className="text-gray-300 -mt-1.5" style={{ fontSize: 17 }}>
                    Agosto/2024
                </Text>

                <TouchableOpacity className="p-2">
                    <Icon source="chevron-right" size={30} color="gray" />
                </TouchableOpacity>
            </View>
        </Body>
    );
}
