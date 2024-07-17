import { SafeAreaView, View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { globalStyle } from "../../globalStyle";

export default function Select({ label = "" }) {
    return (
        <SafeAreaView>
            {label ? <Text style={globalStyle.text}>{label}</Text> : ""}

            <View className="text-gray-200 bg-default-3 w-full rounded mt-1">
                <Picker style={{ color: "#e5e7eb" }}>
                    <Picker.Item label="Ímpar" value="impar" />
                    <Picker.Item label="Par" value="par" />
                </Picker>
            </View>
        </SafeAreaView>
    );
}
