import { Text, View, StatusBar, Alert, Platform } from "react-native";
import Body from "../components/layout/Body";
import { useEffect, useState } from "react";
import { storage, allEmployees, allSectors } from "../Storage";
import HomeScaleList from "./Home/HomeScaleList";
import { nativeApplicationVersion } from "expo-application";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as MediaLibrary from "expo-media-library";
import { Modal, Portal, ProgressBar } from "react-native-paper";
import { globalStyle } from "../globalStyle";

export default function HomeScreen() {
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [showDownloadProgress, setShowDownloadProgress] = useState(false);

    useEffect(() => {
        const employees = storage.getString("employees");
        const histories = storage.getString("histories");
        const historiesObj = histories ? JSON.parse(histories) : [];

        if (employees === undefined) {
            storage.set("employees", JSON.stringify(allEmployees));
        }

        if (!histories || historiesObj.length === 0) {
            storage.set(
                "histories",
                JSON.stringify(
                    allSectors.map((s) => {
                        return {
                            id: s.id,
                            name: s.name,
                            employees: [],
                        };
                    })
                )
            );
        }

        checkForUpdate();
    }, []);

    async function checkForUpdate() {
        try {
            const response = await fetch(
                "https://api.github.com/repos/henriquex25/minha-escala/releases/latest"
            );
            const data = await response.json();

            const latestVersion = parseInt(data.tag_name.replace(/\D/g, "")); // Tag da versão mais recente
            const currentVersion = parseInt(nativeApplicationVersion.replace(/\D/g, "")); // Versão instalada

            if (currentVersion < latestVersion) {
                const apkUrl = data.assets[0].browser_download_url; // URL para baixar o APK

                // Se a versão instalada for menor que a versão mais recente, mostre o alerta
                Alert.alert(
                    "Atualização disponível",
                    `Uma nova versão (${data.tag_name}) está disponível. Deseja atualizar?`,
                    [
                        {
                            text: "Cancelar",
                            style: "cancel",
                        },
                        {
                            text: "Atualizar",
                            onPress: () => {
                                setShowDownloadProgress(true);
                                downloadApk(apkUrl, data.tag_name);
                            },
                        },
                    ]
                );
            }
        } catch (error) {
            console.error("Erro ao verificar a atualização:", error);
        }
    }

    async function downloadApk(uri, version) {
        const downloadDir = FileSystem.documentDirectory + "Download/";
        const fileUri = downloadDir + `minha-escala-${version}.apk`;

        try {
            // Solicitar permissão para acessar a mídia
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permissão necessária",
                    "Permissão de acesso ao armazenamento é necessária para baixar o APK."
                );
                return;
            }

            // Certificar-se de que o diretório de download existe
            const dirInfo = await FileSystem.getInfoAsync(downloadDir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
            }

            // Iniciar o download
            const downloadResumable = await FileSystem.createDownloadResumable(
                uri,
                fileUri,
                {},
                (progress) => {
                    const progressPercentage =
                        (progress.totalBytesWritten / progress.totalBytesExpectedToWrite) * 100;
                    setDownloadProgress(parseInt(progressPercentage));
                }
            );

            const { uri: localUri } = await downloadResumable.downloadAsync();

            setShowDownloadProgress(false);
            setDownloadProgress(0);

            Alert.alert("Download Completo", "O APK foi baixado com sucesso.", [
                {
                    text: "Ok",
                    onPress: () => openFolder(localUri),
                },
            ]);
        } catch (e) {
            console.error(e);
            Alert.alert("Erro", "Ocorreu um erro ao baixar o APK.");
        }
    }

    async function openFolder(fileUri) {
        if (Platform.OS === "android") {
            IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
                data: "content://com.android.externalstorage.documents/document/primary:Download/",
                flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
            });
        }
    }

    return (
        <Body>
            <StatusBar barStyle="light-content" backgroundColor="#2a2a2e" />

            <View>
                <HomeScaleList />
            </View>

            <Portal>
                <Modal
                    visible={showDownloadProgress}
                    dismissable={false}
                    className="px-3"
                    contentContainerStyle={{
                        backgroundColor: "#2a2a2e",
                        padding: 20,
                        borderRadius: 9,
                    }}
                >
                    <Text className="text-primary-500 text-center text-lg mb-4">Baixando...</Text>
                    <Text className="text-primary-500 text-center mb-2">{downloadProgress}%</Text>
                    <ProgressBar
                        progress={downloadProgress / 100}
                        color={globalStyle.theme.primary}
                    />
                </Modal>
            </Portal>
        </Body>
    );
}
