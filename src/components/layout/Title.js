import { Text } from "react-native";

export default function Title(props) {
    return (
        <Text className="text-center text-xl font-bold text-primary-500 my-2" {...props}>
            {props.title}
        </Text>
    );
}
