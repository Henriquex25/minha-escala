import Routes from "./src/routes";
import { NativeWindStyleSheet } from "nativewind";
import { PaperProvider } from "react-native-paper";
import { MD2DarkTheme } from "react-native-paper";
import { StatusBar } from "react-native";

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
        <PaperProvider theme={theme}>
            <Routes />
            <StatusBar style="light" />
        </PaperProvider>
    );
}
