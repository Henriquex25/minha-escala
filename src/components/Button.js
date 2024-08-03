import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Button(props) {
    return (
        <TouchableOpacity
            activeOpacity={0.78}
            className="flex flex-row items-center px-5 py-3 space-x-3 border-b rounded-lg border-gray-400/10 w-full mt-2"
            {...props}
        >
            {props.children}
        </TouchableOpacity>
    );
}
