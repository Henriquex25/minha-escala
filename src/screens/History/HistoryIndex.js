import Body from "../../components/layout/Body";
import Title from "../../components/layout/Title";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HistorySector from "./components/HistorySector";
import { useMMKVObject } from "react-native-mmkv";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import { IconButton } from "react-native-paper";
import DraggableFlatList, { ScaleDecorator, ShadowDecorator, OpacityDecorator, useOnCellActiveAnimation } from "react-native-draggable-flatlist";
import Animated from "react-native-reanimated";
import Label from "../../components/Label";
import { useEffect, useState } from "react";
import { sectors, storage } from "../../Storage";
import { Menu, Icon, Portal, Modal } from "react-native-paper";
import { globalStyle } from "../../globalStyle";
import Button from "../../components/Button";

export default function HistoryIndex({ navigation }) {
    const [histories, setHistories] = useMMKVObject("histories");
    const [visibleModal, setVisibleModal] = useState(false);
    const [sectorsAvailableToChange, setSectorsAvailableToChange] = useState(sectors);
    const [payloadToChangeSectorEmployee, setPayloadToChangeSectorEmployee] = useState({});

    // useEffect(() => {
    //     storage.set(
    //         "histories",
    //         JSON.stringify([
    //             {
    //                 id: "observation",
    //                 name: "Observações",
    //                 employees: [
    //                     {
    //                         id: 1,
    //                         name: "Kaique",
    //                         lastDate: "01/08/2024",
    //                     },
    //                     {
    //                         id: 2,
    //                         name: "Marcus",
    //                         lastDate: "30/07/2024",
    //                     },
    //                 ],
    //             },
    //             {
    //                 id: "receptionC",
    //                 name: "Recepção C",
    //                 employees: [
    //                     {
    //                         id: 3,
    //                         name: "Taiane",
    //                         lastDate: "01/08/2024",
    //                     },
    //                     {
    //                         id: 4,
    //                         name: "Juliana",
    //                         lastDate: "30/07/2024",
    //                     },
    //                 ],
    //             },
    //         ])
    //     );
    // }, []);

    function changeSectorEmployee(toSectorID) {
        const his = histories;
        const fromSectorIndex = payloadToChangeSectorEmployee.fromSectorIndex;
        const toSectorIndex = histories.findIndex((s) => s.id == toSectorID);
        const employee = his[fromSectorIndex].employees.find((e) => e.id === payloadToChangeSectorEmployee.employeeId);

        his[fromSectorIndex].employees = his[fromSectorIndex].employees.filter((e) => e.id !== payloadToChangeSectorEmployee.employeeId);

        his[toSectorIndex].employees = [...his[toSectorIndex].employees, employee];

        setHistories(his);
        setVisibleModal(false);
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
                            style={[{ backgroundColor: isActive ? "#3a3a40" : "#313136", elevation: isActive ? 3 : 0 }]}
                            activeOpacity={1}
                        >
                            <Animated.View className="flex flex-row space-x-2 justify-between w-full">
                                <View className="flex flex-row space-x-2">
                                    <Text className="text-gray-200">{item.name}</Text>
                                    <Text className="text-gray-400">{item.lastDate}</Text>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.78}
                                    onPress={() => {
                                        setPayloadToChangeSectorEmployee({
                                            employeeId: item.id,
                                            fromSectorIndex: sectorIndex,
                                        });
                                        setSectorsAvailableToChange(sectors.filter((s) => s.id !== histories[sectorIndex].id));
                                        setVisibleModal(true);
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

    const renderSector = ({ item, drag, isActive, getIndex }) => {
        const sectorIndex = getIndex();

        return (
            <View className="mt-3 border border-gray-500/50 p-2 rounded-lg relative">
                <Label label={item.name} className="text-primary-400 font-semibold" style={{ fontSize: 16 }} />

                <TouchableOpacity className="absolute -top-2 right-0 p-2" activeOpacity={0.78}>
                    <IconButton icon="plus" size={20} iconColor="#0ea5e9" onPress={() => ""} />
                </TouchableOpacity>

                <DraggableFlatList
                    data={item.employees}
                    renderItem={({ item, drag, isActive, getIndex }) => renderEmployee({ item, drag, isActive, sectorIndex: sectorIndex })}
                    keyExtractor={(item) => item.name}
                    onDragEnd={({ data }) =>
                        setHistories((prevData) => {
                            const prevHistory = prevData;

                            prevHistory[getIndex()].employees = data;

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

                <DraggableFlatList data={histories} keyExtractor={(item) => item.id} renderItem={renderSector} />

                <Portal>
                    <Modal
                        visible={visibleModal}
                        onDismiss={() => setVisibleModal(false)}
                        className="px-2"
                        contentContainerStyle={{ backgroundColor: "#2a2a2e", padding: 20, borderRadius: 9 }}
                    >
                        <Title title="Mudar para:" />

                        <FlatList
                            data={sectorsAvailableToChange}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Button className="bg-default-3" onPress={() => changeSectorEmployee(item.id)}>
                                    <Text className="text-gray-200">{item.name}</Text>
                                </Button>
                            )}
                        />

                        <View className="mt-4 w-full flex justify-end text-end">
                            <TouchableOpacity activeOpacity={0.78} className="self-end px-3 py-2" onPress={() => setVisibleModal(false)}>
                                <Text className="text-gray-400">FECHAR</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </Portal>
            </GestureHandlerRootView>
        </Body>
    );
}
