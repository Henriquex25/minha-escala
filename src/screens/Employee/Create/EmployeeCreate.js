import { useState } from "react";
import { Portal, Modal } from "react-native-paper";
import EmployeeCreateForm from "./EmployeeCreateForm";

export default function EmployeeCreate({ visible = false, hideModal = () => {} }) {
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hideModal}
                className="px-2"
                contentContainerStyle={{ backgroundColor: "#2a2a2e", padding: 20, borderRadius: 9 }}
            >
                <EmployeeCreateForm hideModal={hideModal} />
            </Modal>
        </Portal>
    );
}
