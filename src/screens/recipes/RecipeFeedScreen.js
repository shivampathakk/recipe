import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import client from '../../api/client';
import RecipeCard from '../../components/RecipeCard';
import { AuthContext } from '../../context/AuthContext';

const RecipeFeedScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [mealFilter, setMealFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  const fetchRecipes = async () => {
    try {
      const res = await client.get('/recipes');
      setRecipes(res.data);
    } catch (e) {
      console.log('Error fetching recipes', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', fetchRecipes);
    return unsub;
  }, [navigation]);

  const toggleLike = async (recipe) => {
    const likes = recipe.likes || [];
    const hasLiked = likes.includes(user.id);
    const updatedLikes = hasLiked ? likes.filter((id) => id !== user.id) : [...likes, user.id];

    try {
      await client.patch(`/recipes/${recipe.id}`, { likes: updatedLikes });
      setRecipes((prev) =>
        prev.map((r) => (r.id === recipe.id ? { ...r, likes: updatedLikes } : r))
      );
    } catch (e) {
      console.log('Like error', e);
    }
  };

  const filteredRecipes = recipes
    .filter((r) => {
      const s = search.toLowerCase();
      if (!s) return true;
      const inTitle = r.title.toLowerCase().includes(s);
      const ingredientText = (r.ingredients || [])
        .map((i) => i.name)
        .join(' ')
        .toLowerCase();
      const inIngredients = ingredientText.includes(s);
      return inTitle || inIngredients;
    })
    .filter((r) => (mealFilter === 'all' ? true : r.category === mealFilter))
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '');
      return 0;
    });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const likeCount = item.likes ? item.likes.length : 0;
    const liked = item.likes ? item.likes.includes(user.id) : false;
    return (
      <RecipeCard
        recipe={item}
        likeCount={likeCount}
        liked={liked}
        onLikePress={() => toggleLike(item)}
        onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <Icon name="search" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search by title or ingredient"
          value={search}
          onChangeText={setSearch}
          style={{ flex: 1 }}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        {['all', 'breakfast', 'lunch', 'dinner'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterChip, mealFilter === cat && styles.filterChipActive]}
            onPress={() => setMealFilter(cat)}
          >
            <Text style={[styles.filterText, mealFilter === cat && styles.filterTextActive]}>
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setSortBy(sortBy === 'title' ? 'category' : 'title')}
        >
          <Icon name="swap-vertical" size={18} color="#ff7043" />
          <Text style={styles.sortText}>{sortBy === 'title' ? 'Title' : 'Category'}</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredRecipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Floating create button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateRecipe')}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default RecipeFeedScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: '#ffccbc' },
  filterText: { fontSize: 12, color: '#555' },
  filterTextActive: { color: '#ff7043', fontWeight: '700' },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff3e0',
  },
  sortText: { marginLeft: 4, color: '#ff7043', fontWeight: '600', fontSize: 12 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#ff7043',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

