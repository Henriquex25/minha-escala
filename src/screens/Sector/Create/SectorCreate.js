import { Portal, Modal } from "react-native-paper";
import SectorCreateForm from "./SectorCreateForm";

export default function SectorCreate({ visible = false, hideModal = () => {} }) {
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hideModal}
                className="px-2"
                contentContainerStyle={{ backgroundColor: "#2a2a2e", padding: 20, borderRadius: 9 }}
            >
                <SectorCreateForm hideModal={hideModal} />
            </Modal>
        </Portal>
    );
}
