import {useState} from "react";
import {View} from "react-native";
import {Button, Dialog as PaperDialog, Portal, Text} from "react-native-paper";
import {globalStyle} from "../globalStyle";

export default function Dialog({
                                   visible = false,
                                   hideDialog = () => {
                                   },
                                   onConfirm = () => {
                                   },
                                   message = "Tem certeza de que gostaria de fazer isso?",
                               }) {
    return (
        <View>
            <Portal>
                <PaperDialog visible={visible} onDismiss={hideDialog} className={"bg-default-3"}>
                    <PaperDialog.Title className="text-red-500">Atenção</PaperDialog.Title>
                    <PaperDialog.Content>
                        <Text style={{color: "#d1d5db"}} variant="bodyMedium">{message}</Text>
                    </PaperDialog.Content>
                    <PaperDialog.Actions>
                        <Button textColor="#6b7280" onPress={hideDialog}>
                            Cancelar
                        </Button>
                        <Button onPress={onConfirm} textColor={globalStyle.theme.primary}>Confirmar</Button>
                    </PaperDialog.Actions>
                </PaperDialog>
            </Portal>
        </View>
    );
}
