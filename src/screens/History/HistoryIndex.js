import Body from "../../components/layout/Body";
import Title from "../../components/layout/Title";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMMKVObject } from "react-native-mmkv";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import DraggableFlatList, {
    ScaleDecorator,
    ShadowDecorator,
    OpacityDecorator,
} from "react-native-draggable-flatlist";
import Animated from "react-native-reanimated";
import Label from "../../components/Label";
import { useState } from "react";
import { allSectors } from "../../Storage";
import { Icon, Portal, Modal } from "react-native-paper";
import Button from "../../components/Button";

export default function HistoryIndex({ navigation }) {
    const [histories, setHistories] = useMMKVObject("histories");
    const [visibleModalTransferSectorEmployee, setVisibleModalTransferSectorEmployee] =
        useState(false);
    const [sectorsAvailableToChange, setSectorsAvailableToChange] = useState(allSectors);
    const [payloadToChangeSectorEmployee, setPayloadToChangeSectorEmployee] = useState({});

    function changeSectorEmployee(toSectorID) {
        const his = histories;
        const fromSectorIndex = payloadToChangeSectorEmployee.fromSectorIndex;
        const toSectorIndex = histories.findIndex((s) => s.id == toSectorID);
        const employee = his[fromSectorIndex].employees.find(
            (e) => e.id === payloadToChangeSectorEmployee.employeeId
        );

        his[fromSectorIndex].employees = his[fromSectorIndex].employees.filter(
            (e) => e.id !== payloadToChangeSectorEmployee.employeeId
        );

        his[toSectorIndex].employees = [...his[toSectorIndex].employees, employee];

        setHistories(his);
        setVisibleModalTransferSectorEmployee(false);
        setPayloadToChangeSectorEmployee({});
    }

    const renderEmployee = ({ item, drag, isActive, sectorIndex }) => {
        return (
            <ScaleDecorator activeScale={1.03}>
                <OpacityDecorator activeOpacity={0.6}>
                    <ShadowDecorator>
                        <TouchableOpacity
                            onLongPress={drag}
                            disabled={isActive}
                            className="flex flex-row items-center px-5 py-3 space-x-3 border-b rounded-lg border-gray-400/10 w-full mt-2"
                            style={[
                                {
                                    backgroundColor: isActive ? "#3a3a40" : "#313136",
                                    elevation: isActive ? 3 : 0,
                                },
                            ]}
                            activeOpacity={1}
                        >
                            <Animated.View className="flex flex-row space-x-2 justify-between w-full">
                                <View className="flex flex-row space-x-2">
                                    <Text className="text-gray-200">{item.name}</Text>
                                    <Text className="text-gray-400">
                                        {item.lastDate ? item.lastDate : ""}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.78}
                                    onPress={() => {
                                        setPayloadToChangeSectorEmployee({
                                            employeeId: item.id,
                                            fromSectorIndex: sectorIndex,
                                        });
                                        setSectorsAvailableToChange(
                                            sectors.filter(
                                                (s) => s.id !== histories[sectorIndex].id
                                            )
                                        );
                                        setVisibleModalTransferSectorEmployee(true);
                                    }}
                                >
                                    <Icon source="dots-vertical" color="#0ea5e9" size={20} />
                                </TouchableOpacity>
                            </Animated.View>
                        </TouchableOpacity>
                    </ShadowDecorator>
                </OpacityDecorator>
            </ScaleDecorator>
        );
    };

    const renderSector = ({ item }) => {
        const sectorIndex = histories.findIndex((s) => s.id === item.id);
        const employees = sectorIndex > -1 ? histories[sectorIndex]?.employees : [];

        return (
            <View className="mt-3 border border-gray-500/50 p-2 rounded-lg relative">
                <Label
                    label={item.name}
                    className="text-primary-400 font-semibold"
                    style={{ fontSize: 16 }}
                />

                {/* <TouchableOpacity className="absolute -top-2 right-0 p-2" activeOpacity={0.78}>
                    <IconButton icon="plus" size={20} iconColor="#0ea5e9" onPress={() => ""} />
                </TouchableOpacity> */}

                <DraggableFlatList
                    data={employees}
                    renderItem={({ item, drag, isActive }) =>
                        renderEmployee({ item, drag, isActive, sectorIndex: sectorIndex })
                    }
                    keyExtractor={(item) => item.id}
                    onDragEnd={({ data }) =>
                        setHistories((prevData) => {
                            const prevHistory = prevData;

                            prevHistory[sectorIndex].employees = data;

                            return prevHistory;
                        })
                    }
                />
            </View>
        );
    };

    return (
        <Body>
            <GestureHandlerRootView>
                <Title title="Histórico" />

                <DraggableFlatList
                    data={allSectors}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSector}
                    className="mb-14"
                />

                <Portal>
                    <Modal
                        visible={visibleModalTransferSectorEmployee}
                        onDismiss={() => setVisibleModalTransferSectorEmployee(false)}
                        className="px-2"
                        contentContainerStyle={{
                            backgroundColor: "#2a2a2e",
                            padding: 20,
                            borderRadius: 9,
                        }}
                    >
                        <Title title="Mudar para:" />

                        <FlatList
                            data={sectorsAvailableToChange}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Button
                                    className="bg-default-3"
                                    onPress={() => changeSectorEmployee(item.id)}
                                >
                                    <Text className="text-gray-200">{item.name}</Text>
                                </Button>
                            )}
                        />

                        <View className="mt-4 w-full flex justify-end text-end">
                            <TouchableOpacity
                                activeOpacity={0.78}
                                className="self-end px-3 py-2"
                                onPress={() => setVisibleModalTransferSectorEmployee(false)}
                            >
                                <Text className="text-gray-400">FECHAR</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </Portal>
            </GestureHandlerRootView>
        </Body>
    );
}
