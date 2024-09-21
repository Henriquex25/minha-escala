import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-paper";
import moment from "moment";
import { globalStyle } from "../../globalStyle";

export default function DateTimeInput({
    date,
    setDate,
    label = "",
    mode = "date",
    is24hour = true,
    onValueChange = () => {},
    minimumDate = null,
    maximumDate = null,
}) {
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        if (event.type === "dismissed") {
            setShow(false);
            return;
        }

        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
        onValueChange(currentDate, event);
    };

    const showDateTimepicker = () => {
        setShow(true);
    };

    const getFormat = () => {
        const dt = moment(date);

        if (mode === "date") return dt.format("DD/MM/YYYY");
        if (mode === "datetime") return dt.format("DD/MM/YYYY HH:mm");
        if (mode === "time") return dt.format("HH:mm");
    };

    const getIcon = () => {
        if (mode === "date" || mode === "datetime") return "calendar-month-outline";

        return "clock-time-five-outline";
    };

    return (
        <SafeAreaView style={{ width: "100%" }}>
            <TextInput
                value={getFormat()}
                label={label}
                onPress={showDateTimepicker}
                right={
                    <TextInput.Icon
                        icon={getIcon()}
                        color={"#6b7280"}
                        onPress={showDateTimepicker}
                    />
                }
                style={{ height: 50, backgroundColor: "#3a3a40" }}
                showSoftInputOnFocus={false}
                textColor={"#e5e7eb"}
                underlineColor="#38bdf8"
                activeUnderlineColor="#0369a1"
            />
            {show && (
                <DateTimePicker
                    value={date}
                    mode={mode}
                    is24Hour={is24hour}
                    onChange={onChange}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                />
            )}
        </SafeAreaView>
    );
}
