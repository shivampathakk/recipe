import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import client from '../../api/client';
import { AuthContext } from '../../context/AuthContext';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);

  const loadRecipe = async () => {
    const res = await client.get(`/recipes/${recipeId}`);
    setRecipe(res.data);
  };

  useEffect(() => {
    loadRecipe();
  }, []);

  const toggleLike = async () => {
    if (!recipe) return;
    const likes = recipe.likes || [];
    const hasLiked = likes.includes(user.id);
    const updatedLikes = hasLiked ? likes.filter((id) => id !== user.id) : [...likes, user.id];
    try {
      await client.patch(`/recipes/${recipe.id}`, { likes: updatedLikes });
      setRecipe({ ...recipe, likes: updatedLikes });
    } catch (e) {
      console.log('like error', e);
    }
  };

  const canEdit = recipe && recipe.userId === user.id;

  const deleteRecipe = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this recipe?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await client.delete(`/recipes/${recipe.id}`);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const likeCount = recipe.likes ? recipe.likes.length : 0;
  const liked = recipe.likes ? recipe.likes.includes(user.id) : false;

  return (
    <ScrollView style={styles.container}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={{ color: '#999' }}>No Image</Text>
        </View>
      )}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{recipe.title}</Text>
        <TouchableOpacity style={styles.likeBtn} onPress={toggleLike}>
          <Icon name={liked ? 'heart' : 'heart-outline'} size={24} color="#ff5252" />
          <Text style={styles.likeCount}>{likeCount}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chip}>
        <Text style={styles.chipText}>{recipe.category}</Text>
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.text}>{recipe.description}</Text>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.ingredients?.map((ing, idx) => (
        <Text key={idx} style={styles.text}>
          • {ing.name} - {ing.quantity}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.text}>{recipe.instructions}</Text>

      {canEdit && (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#ffb74d' }]}
            onPress={() => navigation.navigate('EditRecipe', { recipe })}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#e57373' }]}
            onPress={deleteRecipe}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default RecipeDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { height: 220, width: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: '700', flex: 1, marginRight: 8 },
  likeBtn: { flexDirection: 'row', alignItems: 'center' },
  likeCount: { marginLeft: 4, fontSize: 16 },
  chip: {
    alignSelf: 'flex-start',
    marginLeft: 16,
    backgroundColor: '#ffe0b2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: { color: '#ff7043', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 16, marginHorizontal: 16 },
  text: { fontSize: 14, color: '#555', marginHorizontal: 16, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', margin: 16 },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionText: { color: '#fff', fontWeight: '700' },
});

