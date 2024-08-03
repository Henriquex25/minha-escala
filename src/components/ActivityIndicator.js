import { View } from "react-native";
import { ActivityIndicator as RNPActivityIndicator } from "react-native-paper";

export default function ActivityIndicator({ visible = false }) {
    return (
        <>
            {visible && (
                <View className="absolute w-screen h-screen flex justify-center items-center bg-black/60 z-50">
                    <RNPActivityIndicator animating={true} size="large" />
                </View>
            )}
        </>
    );
}
