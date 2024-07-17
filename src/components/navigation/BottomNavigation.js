import { useState } from "react";
import { BottomNavigation as RNBottomNavigation, Text } from "react-native-paper";
import HomeScreen from "../../screens/HomeScreen";
import GenerateScaleScreen from "../../screens/GenerateScaleScreen";

const HomeRoute = () => <HomeScreen />;

const GenerateScaleRoute = () => <GenerateScaleScreen />;

const Routes = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "home", title: "Home", focusedIcon: "home", unfocusedIcon: "home-outline" },
        { key: "generateScale", title: "Gerar Escala", focusedIcon: "refresh" },
    ]);

    const renderScene = RNBottomNavigation.SceneMap({
        home: HomeRoute,
        generateScale: GenerateScaleRoute,
    });

    return <RNBottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} />;
};

export default Routes;
