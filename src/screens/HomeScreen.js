import { Text, View, StatusBar } from "react-native";
import Body from "../components/layout/Body";
import { useEffect } from "react";
import { storage, allEmployees, allSectors } from "../Storage";
import HomeScaleList from "./Home/HomeScaleList";

export default function HomeScreen() {
    useEffect(() => {
        const employees = storage.getString("employees");
        const histories = storage.getString("histories");
        const historiesObj = histories ? JSON.parse(histories) : [];

        if (employees === undefined) {
            storage.set("employees", JSON.stringify(allEmployees));
        }

        if (!histories || historiesObj.length === 0) {
            storage.set(
                "histories",
                JSON.stringify(
                    allSectors.map((s) => {
                        return {
                            id: s.id,
                            name: s.name,
                            employees: [],
                        };
                    })
                )
            );
        }
        // storage.clearAll();
    }, []);

    return (
        <Body>
            <StatusBar barStyle="light-content" backgroundColor="#2a2a2e" />

            <View>
                <HomeScaleList />
            </View>
        </Body>
    );
}
