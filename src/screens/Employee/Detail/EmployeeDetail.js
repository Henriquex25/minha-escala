import { FlatList, Text, View, StyleSheet } from "react-native";
import { Divider } from "react-native-paper";

export default function EmployeeDetail({ route, navigation }) {
    const employee = route.params;
    const activeSectors = getActiveSectors();
    const sectors = {
        receptionC: "Recep. C",
        receptionG: "Recep. G",
        medicalSupport: "Apoio",
        observation: "Observação",
        fastCLM: "Fast CLM",
        fastCollect: "Fast coleta",
        concierge: "Concierge",
    };

    function getActiveSectors() {
        const sectors = Object.keys(employee.sectors);
        return sectors.filter((sector) => employee.sectors[sector]);
    }

    return (
        <View className="px-6 pt-4 gap-y-2">
            <Text className="text-xl text-primary-400 font-semibold pb-2 text-center">{employee.name}</Text>
            <Divider className="my-2 bg-primary-500/40" />
            <View className="flex flex-row">
                <View className="w-[35.5%]">
                    <Text style={styles.label}>ID:</Text>
                </View>
                <Text style={styles.text}>{employee.id}</Text>
            </View>
            <View className="flex flex-row">
                <View className="w-[35.5%]">
                    <Text style={styles.label}>Líder:</Text>
                </View>
                <Text style={styles.text}>{employee.leadership ? "Sim" : "Não"}</Text>
            </View>
            <View className="flex flex-row">
                <View className="w-[35.5%]">
                    <Text style={styles.label}>1ª Referência:</Text>
                </View>
                <Text style={styles.text}>{employee.firstReference ? "Sim" : "Não"}</Text>
            </View>
            <View className="flex flex-row">
                <View className="w-[35.5%]">
                    <Text style={styles.label}>2ª Referência:</Text>
                </View>
                <Text style={styles.text}>{employee.secondReference ? "Sim" : "Não"}</Text>
            </View>

            <View className="flex flex-row">
                <View className="w-[35.5%]">
                    <Text style={styles.label}>Setores:</Text>
                </View>
                {activeSectors.length > 0 && (
                    <FlatList
                        data={activeSectors}
                        renderItem={({ item }) => (
                            <Text className="mr-1.5" style={styles.text}>
                                {sectors[item]}
                            </Text>
                        )}
                        keyExtractor={(item) => item}
                        horizontal={false}
                    />
                )}

                {activeSectors.length === 0 && <Text className="text-gray-500">Nenhum setor atribuído</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        color: "#9ca3af",
        fontSize: 14,
    },
    text: {
        color: "#e5e7eb",
        fontSize: 16,
    },
});
