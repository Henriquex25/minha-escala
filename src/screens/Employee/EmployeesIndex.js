import {TouchableOpacity, StatusBar} from "react-native";
import Body from "../../components/layout/Body";
import Title from "../../components/layout/Title";
import {Icon} from "react-native-paper";
import {useState} from "react";
import EmployeeCreate from "./Create/EmployeeCreate";
import EmployeeList from "./List/EmployeeList";

export default function EmployeesIndex({navigation}) {
    const [showingModalCreateEmployee, setShowingModalCreateEmployee] = useState(false);

    const showModalCreateEmployee = () => setShowingModalCreateEmployee(true);
    const hideModalCreateEmployee = () => setShowingModalCreateEmployee(false);

    return (
        <Body>
            <StatusBar barStyle="light-content" backgroundColor="#2a2a2e"/>

            <Title title="Funcionários"/>

            {/* Lista de funcionários */}
            <EmployeeList navigation={navigation}/>

            {/* Botão abrir modal de criação */}
            <TouchableOpacity
                activeOpacity={0.78}
                className="h-12 w-12 bg-primary-500 text-gray-200 rounded-full flex justify-center items-center absolute top-3 right-5"
                onPress={showModalCreateEmployee}
            >
                <Icon source="plus" size={22} color="white"/>
            </TouchableOpacity>

            {/* Modal de criação */}
            <EmployeeCreate
                visible={showingModalCreateEmployee}
                hideModal={hideModalCreateEmployee}
            />
        </Body>
    );
}
