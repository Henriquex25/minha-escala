import Routes from "./src/routes";
import { NativeWindStyleSheet } from "nativewind";
import { PaperProvider, MD2DarkTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import EmployeeDetails from "./src/screens/Employee/Detail/EmployeeDetail";
import EmployeeEdit from "./src/screens/Employee/Edit/EmployeeEdit";
import GenerateScaleDaysOffCreate from "./src/screens/GenerateScale/DaysOff/Create/GenerateScaleDaysOffCreate";
import GenerateScaleMedicalCertificateCreate from "./src/screens/GenerateScale/MedicalCertificate/Create/GenerateScaleMedicalCertificateCreate";
import GenerateScaleVacationCreate from "./src/screens/GenerateScale/Vacation/Create/GenerateScaleVacationCreate";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

const Stack = createStackNavigator();

NativeWindStyleSheet.setOutput({
    default: "native",
});

const theme = {
    ...MD2DarkTheme,
    colors: {
        ...MD2DarkTheme.colors,
        primary: "#0ea5e9",
        accent: "yellow",
        background: "#2a2a2e",
        text: "#e5e7eb",
    },
};

export default function App() {
    useEffect(() => {
        NavigationBar.setButtonStyleAsync("dark");
    }, []);

    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator
                screenOptions={{
                    cardStyle: { backgroundColor: "#2a2a2e" },
                    headerStyle: { backgroundColor: "#0ea5e9" },
                }}
                theme={theme}
            >
                <Stack.Screen name="Main" options={{ headerShown: false }}>
                    {() => (
                        <PaperProvider theme={theme}>
                            <Routes />
                        </PaperProvider>
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="EmployeeEdit"
                    component={EmployeeEdit}
                    options={{ title: "Editar" }}
                />
                <Stack.Screen
                    name="EmployeeDetails"
                    component={EmployeeDetails}
                    options={{ title: "Detalhes" }}
                />
                <Stack.Screen
                    name="DaysOffCreate"
                    component={GenerateScaleDaysOffCreate}
                    options={{ title: "Adicionar folga" }}
                />
                <Stack.Screen
                    name="MedicalCertificatesCreate"
                    component={GenerateScaleMedicalCertificateCreate}
                    options={{ title: "Atestado" }}
                />
                <Stack.Screen
                    name="VacationCreate"
                    component={GenerateScaleVacationCreate}
                    options={{ title: "Férias" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
