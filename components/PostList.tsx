
import { StyleSheet } from 'react-native';
import LocationBadge from './LocationBadge';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import PostCard from './PostCard';
import ViewPostTest from '../constants/ViewPostTest';



export default function PostList() {
  return (
      <View style={styles.cardWrapper}>
        <PostCard post={ViewPostTest[0]}></PostCard>
        <PostCard post={ViewPostTest[1]}></PostCard>
        <PostCard post={ViewPostTest[2]}></PostCard>
      </View>
  );
}




const styles = StyleSheet.create({
  cardWrapper: {
    padding:24,
    backgroundColor: "rgba(200,168,214,1)"
  }
});
