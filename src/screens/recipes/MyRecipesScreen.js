import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import client from '../../api/client';
import { AuthContext } from '../../context/AuthContext';
import RecipeCard from '../../components/RecipeCard';

const MyRecipesScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);

  const loadMyRecipes = async () => {
    const res = await client.get('/recipes', { params: { userId: user.id } });
    setRecipes(res.data);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadMyRecipes);
    return unsub;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <RecipeCard
      recipe={item}
      likeCount={item.likes ? item.likes.length : 0}
      liked={item.likes ? item.likes.includes(user.id) : false}
      onLikePress={() => {}} // optional here
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Recipes</Text>
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>You haven&apos;t created any recipes yet.</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateRecipe')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyRecipesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff7043',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
