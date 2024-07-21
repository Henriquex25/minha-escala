import { Text, View } from "react-native";
import EmployeeEditForm from "./EmployeeEditForm";

export default function EmployeeEdit({ route, navigation }) {
    const employee = route.params;

    return (
        <View className="px-6 pt-4">
            <EmployeeEditForm navigation={navigation} employee={employee} />
        </View>
    );
}
