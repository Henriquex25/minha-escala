import { Text, View, StatusBar } from "react-native";
import Body from "../components/layout/Body";

export default function HomeScreen() {
    return (
        <Body>
            <StatusBar barStyle="light-content" backgroundColor="#2a2a2e" />

            <View className="text-gray-400">
                <View className="mx-auto bg-gray-600 w-full px-5 rounded-xl pt-2">
                    {/* Header */}
                    <View>
                        <Text className="text-center text-2xl font-bold text-gray-200">Dimensionamento</Text>
                        <Text className="text-gray-200 font-bold text-xl text-center">14/07/2024</Text>
                    </View>

                    {/* HR */}
                    <View className="border-b border-gray-400/10 mt-5"></View>

                    {/* Content */}
                    <View>
                        {/* Recepção Bloco C */}
                        <View>
                            <Text className="mt-6 text-gray-300 font-semibold">Recepção bloco C</Text>
                            <View className="flex flex-row items-center mt-1.5 space-x-2.5">
                                <Text className="text-gray-300">Luana</Text>
                                <Text className="text-gray-400">🍝 22:50 às 23:10 / 🛏 04:00 às 05:00 </Text>
                            </View>
                        </View>

                        {/* Recepção Bloco G */}
                        <View>
                            <Text className="mt-6 text-gray-300 font-semibold">Recepção bloco G</Text>
                            <View className="flex flex-row items-center mt-1.5 space-x-2.5">
                                <Text className="text-gray-300">Luana</Text>
                                <Text className="text-gray-400">🍝 22:50 às 23:10 / 🛏 04:00 às 05:00 </Text>
                            </View>
                            <View className="flex flex-row items-center mt-1.5 space-x-2.5">
                                <Text className="text-gray-300">Luana</Text>
                                <Text className="text-gray-400">🍝 22:50 às 23:10 / 🛏 04:00 às 05:00 </Text>
                            </View>
                            <View className="flex flex-row items-center mt-1.5 space-x-2.5">
                                <Text className="text-gray-300">Luana</Text>
                                <Text className="text-gray-400">🍝 22:50 às 23:10 / 🛏 04:00 às 05:00 </Text>
                            </View>
                            <View className="flex flex-row items-center mt-1.5 space-x-2.5">
                                <Text className="text-gray-300">Luana</Text>
                                <Text className="text-gray-400">🍝 22:50 às 23:10 / 🛏 04:00 às 05:00 </Text>
                            </View>
                            <View className="flex flex-row items-center mt-1.5 space-x-2.5">
                                <Text className="text-gray-300">Luana</Text>
                                <Text className="text-gray-400">🍝 22:50 às 23:10 / 🛏 04:00 às 05:00 </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Body>
    );
}
