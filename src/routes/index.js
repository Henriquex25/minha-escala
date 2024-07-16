import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import GenerateScaleScreen from "../screens/GenerateScaleScreen";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "../screens/HomeScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
const { Navigator, Screen } = createBottomTabNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: "#e5e7eb",
                    tabBarInactiveTintColor: "#9ca3af",
                    tabBarActiveBackgroundColor: "#0369a1",
                    tabBarInactiveBackgroundColor: "#2a2a2e",
                }}
            >
                <Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ focused, color }) => {
                            const iconName = focused ? "home" : "home-outline";

                            return <Ionicons name={iconName} size={22} color={color} />;
                        },
                    }}
                />
                <Screen
                    name="Gerar Escala"
                    component={GenerateScaleScreen}
                    options={{
                        tabBarIcon: ({ focused, color }) => {
                            const iconName = focused ? "refresh-circle" : "refresh-circle-outline";

                            return <Ionicons name={iconName} size={26} color={color} />;
                        },
                    }}
                />
            </Navigator>

            <StatusBar style="light" />
        </NavigationContainer>
    );
}
