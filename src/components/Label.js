import { Text } from "react-native";
import { globalStyle } from "../globalStyle";

export default function Label(props) {
    return (
        <Text className="mb-1 px-1" style={{ ...globalStyle.text, ...(props.style ?? {}) }} {...props}>
            {props.label}
        </Text>
    );
}
