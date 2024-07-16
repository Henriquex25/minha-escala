import { View } from 'react-native'

export default function Body({ children }) {
    return (
        <View className="flex-1 bg-default-1 px-6 pt-[15%]">
            {children}
        </View>
    )
}