import React, { useState } from "react";
import { Button, Text, View, Modal } from "react-native";
//import Modal from "react-native";

export default function ModalTest() {
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View style={{ flex: 1 }}>
            <Button title="Show modal" onPress={toggleModal} />

            <Modal visible={isModalVisible}>
                <View style={{ flex: 1 }}>
                    <Text>Ride info</Text>

                    <Button title="Hide modal" onPress={toggleModal} />
                 </View>
            </Modal>
        </View>
    )
}