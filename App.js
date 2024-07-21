import Routes from "./src/routes";
import { NativeWindStyleSheet } from "nativewind";
import { PaperProvider, MD2DarkTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import EmployeeDetails from "./src/screens/Employee/Detail/EmployeeDetail";
import EmployeeEdit from "./src/screens/Employee/Edit/EmployeeEdit";

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
    },
};

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    cardStyle: { backgroundColor: "#2a2a2e" },
                    headerStyle: { backgroundColor: "#0ea5e9" },
                }}
            >
                <Stack.Screen name="Main" options={{ headerShown: false }}>
                    {() => (
                        <PaperProvider theme={theme}>
                            <Routes />
                        </PaperProvider>
                    )}
                </Stack.Screen>
                <Stack.Screen name="EmployeeEdit" component={EmployeeEdit} options={{ title: "Editar" }} />
                <Stack.Screen name="EmployeeDetails" component={EmployeeDetails} options={{ title: "Detalhes" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
