import { useState, useEffect } from "react";
import { View, FlatList, Text, Platform, ToastAndroid } from "react-native";
import { Menu, Icon, IconButton, TextInput, Searchbar } from "react-native-paper";
import { storage } from "../../../Storage";
import Dialog from "../../../components/Dialog";

export default function EmployeeList({ navigation }) {
    const [employees, setEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [visibleMenus, setVisibleMenus] = useState({});
    const [showingDeleteDialog, setShowingDeleteDialog] = useState(false);
    const [employeeIdToDelete, setEmployeeIdToDelete] = useState(0);

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

    function fetchEmployees() {
        const storedEmployees = storage.getString("employees");
        const storedEmployeesObj = storedEmployees ? JSON.parse(storedEmployees) : [];

        setEmployees(storedEmployeesObj);
        setAllEmployees(storedEmployeesObj);
    }

    function deleteEmployee() {
        if (!employeeIdToDelete) {
            return;
        }

        const employees = JSON.parse(storage.getString("employees"));
        const employeeIndex = employees.findIndex((e) => e.id === employeeIdToDelete);
        employees.splice(employeeIndex, 1);
        storage.set("employees", JSON.stringify(employees));

        if (Platform.OS === "android") {
            ToastAndroid.show("Funcionário excluído com sucesso ✓", ToastAndroid.SHORT);
        }

        hideDialog();
    }

    useEffect(() => {
        const listener = storage.addOnValueChangedListener((changedKey) => {
            if (changedKey === "employees") {
                fetchEmployees();
            }
        });

        return () => listener.remove();
    }, []);

    useEffect(() => fetchEmployees(), []);

    return (
        <View className="mt-2 mb-14">
            {/* Filtrar funcionários */}
            <View>
                <Searchbar
                    placeholder="Pesquisar funcionário"
                    className="mt-3 bg-default-3 text-gray-200 mb-3 rounded-3xl"
                    inputStyle={{ color: "#e5e7eb" }}
                    iconColor="#0ea5e9"
                    placeholderTextColor={"#9ca3af"}
                    onChangeText={(query) => {
                        setEmployees(
                            allEmployees.filter((employee) =>
                                employee.name
                                    .toLowerCase()
                                    .trim()
                                    .includes(query.toLowerCase().trim())
                            )
                        );
                    }}
                />
            </View>

            {employees.length > 0 ? (
                <FlatList
                    className="mb-14"
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
                                anchor={
                                    <IconButton
                                        icon="dots-vertical"
                                        iconColor="#0ea5e9"
                                        size={20}
                                        onPress={() => openMenu(item.id)}
                                    />
                                }
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

            <Dialog
                visible={showingDeleteDialog}
                hideDialog={hideDialog}
                onConfirm={deleteEmployee}
            />
        </View>
    );
}
