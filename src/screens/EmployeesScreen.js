import { TouchableOpacity } from "react-native";
import Body from "../components/layout/Body";
import Title from "../components/layout/Title";
import { Icon, Modal, Portal } from "react-native-paper";
import { useState } from "react";
import CreateEmployee from "../components/employee/CreateEmployee";

export default function EmployeesScreen() {
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    return (
        <Body>
            <Title title="Funcionários" />

            <TouchableOpacity
                activeOpacity={0.78}
                className="h-16 w-16 bg-primary-500 text-gray-200 rounded-full flex justify-center items-center absolute bottom-6 right-5"
                onPress={() => showModal(true)}
            >
                <Icon source="plus" size={22} color="white" />
            </TouchableOpacity>

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    className="px-2"
                    contentContainerStyle={{ backgroundColor: "#2a2a2e", padding: 20, borderRadius: 9 }}
                >
                    <CreateEmployee />
                </Modal>
            </Portal>
        </Body>
    );
}
