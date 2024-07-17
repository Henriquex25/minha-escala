import { useState } from "react";
import { SafeAreaView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-paper";
import moment from "moment";

export default function DateTimeInput({ value = new Date(), label = "", mode = "date", is24hour = true }) {
    const [date, setDate] = useState(value);
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
    };

    const showDateTimepicker = () => {
        showMode("date");
    };

    return (
        <SafeAreaView style={{ width: "100%" }}>
            <TextInput
                value={moment(date).format("DD/MM/YYYY")}
                label={label}
                onPress={showDateTimepicker}
                right={<TextInput.Icon icon="calendar-month-outline" color={"#6b7280"} onPress={showDateTimepicker} />}
                style={{ height: 58, backgroundColor: "#3a3a40" }}
            />
            {show && <DateTimePicker value={date} mode={mode} is24Hour={is24hour} onChange={onChange} />}
        </SafeAreaView>
    );
}
