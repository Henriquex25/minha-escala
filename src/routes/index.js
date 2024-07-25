import { useState } from "react";
import { BottomNavigation as RNBottomNavigation, Text } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";
import GenerateScaleIndex from "../screens/GenerateScale/GenerateScaleIndex";
import EmployeesIndex from "../screens/Employee/EmployeesIndex";
import { useNavigation } from "@react-navigation/native";
import SectorIndex from "../screens/Sector/SectorIndex";

const HomeRoute = () => <HomeScreen />;
const GenerateScaleRoute = () => <GenerateScaleIndex navigation={useNavigation()} />;
// const SectorRoute = () => <SectorIndex navigation={useNavigation()} />;
const EmployeeRoute = () => <EmployeesIndex navigation={useNavigation()} />;

const Routes = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "home", title: "Home", focusedIcon: "home", unfocusedIcon: "home-outline" },
        { key: "generateScale", title: "Gerar Escala", focusedIcon: "refresh" },
        { key: "employee", title: "Funcionários", focusedIcon: "account-multiple", unfocusedIcon: "account-multiple-outline" },
        // { key: "sector", title: "Setores", focusedIcon: "clipboard-text", unfocusedIcon: "clipboard-text-outline" },
    ]);

    const renderScene = RNBottomNavigation.SceneMap({
        home: HomeRoute,
        generateScale: GenerateScaleRoute,
        employee: EmployeeRoute,
        // sector: SectorRoute,
    });

    return <RNBottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} />;
};

export default Routes;
