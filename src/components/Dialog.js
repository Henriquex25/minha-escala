import { useState } from "react";
import { View } from "react-native";
import { Button, Dialog as PaperDialog, Portal, Text } from "react-native-paper";

export default function Dialog({
    visible = false,
    hideDialog = () => {},
    onConfirm = () => {},
    message = "Tem certeza de que gostaria de fazer isso?",
}) {
    return (
        <View>
            <Portal>
                <PaperDialog visible={visible} onDismiss={hideDialog}>
                    <PaperDialog.Title className="text-red-500">Atenção</PaperDialog.Title>
                    <PaperDialog.Content>
                        <Text variant="bodyMedium">{message}</Text>
                    </PaperDialog.Content>
                    <PaperDialog.Actions>
                        <Button textColor="#6b7280" onPress={hideDialog}>
                            Cancelar
                        </Button>
                        <Button onPress={onConfirm}>Confirmar</Button>
                    </PaperDialog.Actions>
                </PaperDialog>
            </Portal>
        </View>
    );
}
