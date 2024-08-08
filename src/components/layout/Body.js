import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Body({ children }) {
    return <SafeAreaView className="flex-1 bg-default-1 px-5 pt-4">{children}</SafeAreaView>;
}
