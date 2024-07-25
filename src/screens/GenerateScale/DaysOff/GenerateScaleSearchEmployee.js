import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";

export default function GenerateScaleSearchEmployee() {
    const [employees, setEmployees] = useState();

    function fetchEmployees() {
        const storedEmployees = storage.getString("employees");

        setEmployees(storedEmployees ? JSON.parse(storedEmployees) : []);
    }

    useEffect(() => fetchEmployees(), []);

    return (
        <View>
            <FlatList
                data={employees}
                renderItem={({ item }) => (
                    <View className="flex flex-row items-center bg-default-3 pl-2.5 rounded-lg mb-2">
                        <Text className="w-[72%] text-gray-200 truncate">{item.name}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}
