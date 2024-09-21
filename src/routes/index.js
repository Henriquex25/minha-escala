import { useState } from "react";
import { BottomNavigation as RNBottomNavigation, Text } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";
import GenerateScaleIndex from "../screens/GenerateScale/GenerateScaleIndex";
import EmployeesIndex from "../screens/Employee/EmployeesIndex";
import { useNavigation } from "@react-navigation/native";
import HistoryIndex from "../screens/History/HistoryIndex";
import MonthlyScaleIndex from "../screens/MonthlyScale/MonthlyScaleIndex";
import SectorIndex from "../screens/Sector/SectorIndex";

const HomeRoute = () => <HomeScreen />;
const GenerateScaleRoute = () => <GenerateScaleIndex navigation={useNavigation()} />;
const EmployeeRoute = () => <EmployeesIndex navigation={useNavigation()} />;
const SectorRoute = () => <SectorIndex navigation={useNavigation()} />;
const HistoryRoute = () => <HistoryIndex navigation={useNavigation()} />;
const MonthlyScaleRoute = () => <MonthlyScaleIndex navigation={useNavigation()} />;

const Routes = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "home", title: "Home", focusedIcon: "home", unfocusedIcon: "home-outline" },
        { key: "generateScale", title: "Gerar Escala", focusedIcon: "refresh" },
        {
            key: "employee",
            title: "Colaboradores",
            focusedIcon: "account-multiple",
            unfocusedIcon: "account-multiple-outline",
        },
        {
            key: "sector",
            title: "Setores",
            focusedIcon: "table-account",
            unfocusedIcon: "table-account",
        },
        {
            key: "history",
            title: "Histórico",
            focusedIcon: "clock-time-five",
            unfocusedIcon: "clock-time-five-outline",
        },
        // {
        //     key: "monthlyScale",
        //     title: "Escala",
        //     focusedIcon: "calendar-month",
        //     unfocusedIcon: "calendar-month-outline",
        // },
    ]);

    const renderScene = RNBottomNavigation.SceneMap({
        home: HomeRoute,
        generateScale: GenerateScaleRoute,
        employee: EmployeeRoute,
        sector: SectorRoute,
        history: HistoryRoute,
        // monthlyScale: MonthlyScaleRoute,
    });

    return (
        <RNBottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
};

export default Routes;
