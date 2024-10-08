import { useState, useEffect } from "react";
import { View, FlatList, Text, Platform, ToastAndroid } from "react-native";
import { Menu, Icon, IconButton } from "react-native-paper";
import { storage } from "../../../Storage";
import Dialog from "../../../components/Dialog";

export default function SectorList({ navigation }) {
    const [sectors, setSectors] = useState([]);
    const [visibleMenus, setVisibleMenus] = useState({});
    const [showingDeleteDialog, setShowingDeleteDialog] = useState(false);
    const [sectorIdToDelete, setEmployeeIdToDelete] = useState(0);

    function openMenu(id) {
        setVisibleMenus((prevState) => ({ ...prevState, [id]: true }));
    }

    function closeMenu(id) {
        setVisibleMenus((prevState) => ({ ...prevState, [id]: false }));
    }

    function showDialog() {
        setShowingDeleteDialog(true);
    }

    function hideDialog() {
        setShowingDeleteDialog(false);
    }

    function fetchSectors() {
        const storedSectors = storage.getString("sectors");

        setSectors(storedSectors ? JSON.parse(storedSectors) : []);
    }

    function deleteSector() {
        if (!sectorIdToDelete) {
            return;
        }

        const sectors = JSON.parse(storage.getString("sectors"));
        const sectorIndex = sectors.findIndex((e) => e.id === sectorIdToDelete);

        sectors.splice(sectorIndex, 1);

        storage.set("sectors", JSON.stringify(sectors));

        if (Platform.OS === "android") {
            ToastAndroid.show("Setor excluído com sucesso ✓", ToastAndroid.SHORT);
        }

        hideDialog();
    }

    useEffect(() => {
        const listener = storage.addOnValueChangedListener((changedKey) => {
            if (changedKey === "employees") {
                fetchSectors();
            }
        });

        return () => listener.remove();
    }, []);

    useEffect(() => fetchSectors(), []);

    return (
        <View className="mt-2">
            {employees.length > 0 ? (
                <FlatList
                    data={employees}
                    renderItem={({ item }) => (
                        <View className="flex flex-row items-center bg-default-3 pl-2.5 rounded-lg mb-2">
                            <View className="pr-2.5">
                                <Icon source={"account"} size={23} />
                            </View>

                            <Text className="w-[72%] text-gray-200 truncate">{item.name}</Text>

                            {/* Opções */}
                            <Menu
                                visible={visibleMenus[item.id]}
                                onDismiss={() => closeMenu(item.id)}
                                anchor={<IconButton icon="dots-vertical" iconColor="#0ea5e9" size={20} onPress={() => openMenu(item.id)} />}
                            >
                                {/* Editar */}
                                <Menu.Item
                                    title="Editar"
                                    leadingIcon="pencil-outline"
                                    onPress={() => {
                                        navigation.navigate("EmployeeEdit", { ...item });
                                        closeMenu(item.id);
                                    }}
                                />

                                {/* Visualizar */}
                                <Menu.Item
                                    title="Visualizar"
                                    leadingIcon="eye-outline"
                                    onPress={() => {
                                        navigation.navigate("EmployeeDetails", { ...item });
                                        closeMenu(item.id);
                                    }}
                                />

                                {/* Excluir */}
                                <Menu.Item
                                    title="Excluir"
                                    leadingIcon="trash-can-outline"
                                    onPress={() => {
                                        setEmployeeIdToDelete(item.id);
                                        closeMenu(item.id);
                                        showDialog();
                                    }}
                                />
                            </Menu>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                />
            ) : (
                <Text className="text-gray-400 text-center">Nenhum funcionário cadastrado</Text>
            )}

            <Dialog visible={showingDeleteDialog} hideDialog={hideDialog} onConfirm={deleteSector} />
        </View>
    );
}
