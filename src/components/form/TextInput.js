import { View } from "react-native";
import { TextInput as RNTextInput } from "react-native-paper";
import Label from "../Label";

export default function TextInput({ label = "", style = {}, props = {} }) {
    return (
        <View>
            <Label label={label} />
            <RNTextInput label={label} style={{ height: 60, backgroundColor: "transparent", ...style }} {...props} />
        </View>
    );
}
