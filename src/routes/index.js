import { useState } from "react";
import { BottomNavigation as RNBottomNavigation, Text } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";
import GenerateScaleScreen from "../screens/GenerateScaleScreen";
import EmployeesIndex from "../screens/Employee/EmployeesIndex";
import { useNavigation } from "@react-navigation/native";

const HomeRoute = () => <HomeScreen />;
const GenerateScaleRoute = () => <GenerateScaleScreen />;
const EmployeesRoute = () => {
    const navigation = useNavigation();

    return <EmployeesIndex navigation={navigation} />;
};

const Routes = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "home", title: "Home", focusedIcon: "home", unfocusedIcon: "home-outline" },
        { key: "generateScale", title: "Gerar Escala", focusedIcon: "refresh" },
        { key: "employees", title: "Funcionários", focusedIcon: "account-multiple", unfocusedIcon: "account-multiple-outline" },
    ]);

    const renderScene = RNBottomNavigation.SceneMap({
        home: HomeRoute,
        generateScale: GenerateScaleRoute,
        employees: EmployeesRoute,
    });

    return <RNBottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} />;
};

export default Routes;
