import { View, TouchableOpacity, Text } from "react-native";
import { IconButton } from "react-native-paper";
import DraggableFlatList, { ScaleDecorator, ShadowDecorator, OpacityDecorator, useOnCellActiveAnimation } from "react-native-draggable-flatlist";
import Animated from "react-native-reanimated";
import Label from "../../../components/Label";

export default function HistorySector({ history, setHistory }) {
    const renderSector = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator activeScale={1.03}>
                <OpacityDecorator activeOpacity={0.6}>
                    <ShadowDecorator>
                        <TouchableOpacity
                            onLongPress={drag}
                            disabled={isActive}
                            className="flex flex-row items-center px-5 py-3 space-x-3 border-b rounded-lg border-gray-400/10 w-full mt-2"
                            style={[{ backgroundColor: isActive ? "#3a3a40" : "#313136", elevation: isActive ? 3 : 0 }]}
                            activeOpacity={1}
                        >
                            <Animated.View className="flex flex-row space-x-2">
                                <Text className="text-gray-200">{item.employee.name}</Text>
                                <Text className="text-gray-200">{item.date}</Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </ShadowDecorator>
                </OpacityDecorator>
            </ScaleDecorator>
        );
    };

    return (
        <View className="mt-2 border border-gray-500/50 p-2 rounded-lg relative">
            <Label label={name} className="text-primary-400 font-semibold" style={{ fontSize: 16 }} />

            <TouchableOpacity className="absolute -top-2 right-0 p-2" activeOpacity={0.78}>
                <IconButton icon="plus" size={20} iconColor="#0ea5e9" onPress={() => ""} />
            </TouchableOpacity>

            {history[sector]?.length > 0 && (
                <DraggableFlatList
                    data={history[sector]}
                    onDragEnd={({ data }) => setHistory({ ...history, [sector]: data })}
                    keyExtractor={(item) => item.employee.name}
                    renderItem={renderSector}
                    nestedScrollEnabled={true}
                />
            )}
        </View>
    );
}
