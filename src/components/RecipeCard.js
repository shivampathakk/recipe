import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const RecipeCard = ({ recipe, onPress, onLikePress, liked, likeCount }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{recipe.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{recipe.description}</Text>
        <View style={styles.footer}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{recipe.category}</Text>
          </View>
          <TouchableOpacity style={styles.likeBtn} onPress={onLikePress}>
            <Icon name={liked ? 'heart' : 'heart-outline'} size={20} color="#ff5252" />
            <Text style={styles.likeCount}>{likeCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  image: { height: 160, width: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' },
  placeholderText: { color: '#999' },
  content: { padding: 12 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  description: { fontSize: 14, color: '#666' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  chip: {
    backgroundColor: '#ffe0b2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: { color: '#ff7043', fontSize: 12, fontWeight: '600' },
  likeBtn: { flexDirection: 'row', alignItems: 'center' },
  likeCount: { marginLeft: 4, fontSize: 14, color: '#333' },
});
