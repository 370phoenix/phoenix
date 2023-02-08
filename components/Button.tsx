import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { brandColors } from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';


export default function Button({ msg, style }: {  msg: string, style: any }) {
  return (
      <Pressable>
        <View style={style}>
          <Text style={styles.buttonText}>
              {msg}
          </Text>
        </View>
      </Pressable>
  );
}


const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white'
  }
});
