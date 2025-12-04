// import React, { useContext, useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import client from '../../api/client';
// import { AuthContext } from '../../context/AuthContext';
// import RecipeCard from '../../components/RecipeCard';

// const MyRecipesScreen = ({ navigation }) => {
//   const { user } = useContext(AuthContext);
//   const [recipes, setRecipes] = useState([]);

//   const loadMyRecipes = async () => {
//     const res = await client.get('/recipes', { params: { userId: user.id } });
//     setRecipes(res.data);
//   };

//   useEffect(() => {
//     const unsub = navigation.addListener('focus', loadMyRecipes);
//     return unsub;
//   }, [navigation]);

//   const renderItem = ({ item }) => (
//     <RecipeCard
//       recipe={item}
//       likeCount={item.likes ? item.likes.length : 0}
//       liked={item.likes ? item.likes.includes(user.id) : false}
//       onLikePress={() => {}} // optional here
//       onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
//     />
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>My Recipes</Text>
//       <FlatList
//         data={recipes}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         ListEmptyComponent={<Text>You haven&apos;t created any recipes yet.</Text>}
//       />

//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => navigation.navigate('CreateRecipe')}
//       >
//         <Text style={styles.fabText}>+</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default MyRecipesScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
//   header: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
//   fab: {
//     position: 'absolute',
//     right: 24,
//     bottom: 24,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#ff7043',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
// });






// import React, { useContext, useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import client from '../../api/client';
// import { AuthContext } from '../../context/AuthContext';
// import RecipeCard from '../../components/RecipeCard';

// const MyRecipesScreen = ({ navigation }) => {
//   const { user } = useContext(AuthContext);
//   const [recipes, setRecipes] = useState([]);

//   const loadMyRecipes = async () => {
//     try {
//       const res = await client.get('/recipes', { params: { userId: user.id } });
//       setRecipes(res.data);
//     } catch (e) {
//       console.log('Error loading my recipes', e);
//     }
//   };

//   useEffect(() => {
//     const unsub = navigation.addListener('focus', loadMyRecipes);
//     return unsub;
//   }, [navigation]);

//   const renderItem = ({ item }) => (
//     <RecipeCard
//       recipe={item}
//       likeCount={item.likes ? item.likes.length : 0}
//       liked={item.likes ? item.likes.includes(user.id) : false}
//       onLikePress={() => {}}
//       // 🟢 IMPORTANT: nested navigation (Tab -> Home Stack -> RecipeDetail)
//       onPress={() =>
//         navigation.navigate('Home', {
//           screen: 'RecipeDetail',
//           params: { recipeId: item.id },
//         })
//       }
//     />
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>My Recipes</Text>
//       <FlatList
//         data={recipes}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         ListEmptyComponent={<Text>You haven&apos;t created any recipes yet.</Text>}
//         contentContainerStyle={{ paddingBottom: 80 }}
//       />

//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() =>
//           navigation.navigate('Home', {
//             screen: 'CreateRecipe',
//           })
//         }
//       >
//         <Text style={styles.fabText}>+</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default MyRecipesScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
//   header: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
//   fab: {
//     position: 'absolute',
//     right: 24,
//     bottom: 24,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#ff7043',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 4,
//   },
//   fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
// });





import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../../api/client';
import { AuthContext } from '../../context/AuthContext';
import RecipeCard from '../../components/RecipeCard';

const MyRecipesScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);

  const loadMyRecipes = async () => {
    try {
      const res = await client.get('/recipes', { params: { userId: user.id } });
      setRecipes(res.data);
    } catch (e) {
      console.log('Error loading my recipes', e);
    }
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
      onLikePress={() => {}}
      onPress={() =>
        navigation.navigate('Home', {
          screen: 'RecipeDetail',
          params: { recipeId: item.id },
        })
      }
    />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>My Recipes</Text>
            <Text style={styles.headerSubtitle}>
              {recipes.length === 0
                ? 'Start by creating your first recipe'
                : `${recipes.length} recipe${recipes.length > 1 ? 's' : ''} created`}
            </Text>
          </View>
        </View>

        {/* List */}
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>You haven&apos;t created any recipes yet.</Text>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Floating add button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'CreateRecipe',
            })
          }
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyRecipesScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#777',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyText: {
    marginTop: 24,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
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
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
  },
});
