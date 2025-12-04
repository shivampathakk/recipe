// import React, { useContext } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { AuthContext } from '../context/AuthContext';

// // Auth screens
// import LoginScreen from '../screens/auth/LoginScreen';
// import SignupScreen from '../screens/auth/SignupScreen';

// // Recipe screens
// import RecipeFeedScreen from '../screens/recipes/RecipeFeedScreen';
// import RecipeDetailScreen from '../screens/recipes/RecipeDetailScreen';
// import CreateRecipeScreen from '../screens/recipes/CreateRecipeScreen';
// import EditRecipeScreen from '../screens/recipes/EditRecipeScreen';
// import MyRecipesScreen from '../screens/recipes/MyRecipesScreen';

// // Profile
// import ProfileScreen from '../screens/profile/ProfileScreen';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// const HomeStack = () => (
//   <Stack.Navigator>
//     <Stack.Screen name="RecipeFeed" component={RecipeFeedScreen} options={{ title: 'Recipes' }} />
//     <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Recipe Detail' }} />
//     <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} options={{ title: 'Create Recipe' }} />
//     <Stack.Screen name="EditRecipe" component={EditRecipeScreen} options={{ title: 'Edit Recipe' }} />
//   </Stack.Navigator>
// );

// const AppTabs = () => (
//   <Tab.Navigator
//     screenOptions={({ route }) => ({
//       headerShown: false,
//       tabBarIcon: ({ color, size }) => {
//         let name = 'home';
//         if (route.name === 'Home') name = 'home';
//         if (route.name === 'MyRecipes') name = 'book';
//         if (route.name === 'Profile') name = 'person';
//         return <Icon name={name} size={size} color={color} />;
//       },
//       tabBarActiveTintColor: '#ff7043',
//       tabBarInactiveTintColor: '#757575',
//     })}
//   >
//     <Tab.Screen name="Home" component={HomeStack} />
//     <Tab.Screen name="MyRecipes" component={MyRecipesScreen} options={{ title: 'My Recipes' }} />
//     <Tab.Screen name="Profile" component={ProfileScreen} />
//   </Tab.Navigator>
// );

// const RootStack = createNativeStackNavigator();

// const RootNavigation = () => {
//   const { user, loading } = useContext(AuthContext);

//   if (loading) {
//     return null; // you can show splash
//   }

//   return (
//     <NavigationContainer>
//       {user ? (
//         <RootStack.Navigator screenOptions={{ headerShown: false }}>
//           <RootStack.Screen name="AppTabs" component={AppTabs} />
//         </RootStack.Navigator>
//       ) : (
//         <RootStack.Navigator>
//           <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//           <RootStack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign Up' }} />
//         </RootStack.Navigator>
//       )}
//     </NavigationContainer>
//   );
// };

// export default RootNavigation;




import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Recipe screens
import RecipeFeedScreen from '../screens/recipes/RecipeFeedScreen';
import RecipeDetailScreen from '../screens/recipes/RecipeDetailScreen';
import CreateRecipeScreen from '../screens/recipes/CreateRecipeScreen';
import EditRecipeScreen from '../screens/recipes/EditRecipeScreen';
import MyRecipesScreen from '../screens/recipes/MyRecipesScreen';

// Profile
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RecipeFeed"
      component={RecipeFeedScreen}
      options={{ title: 'Recipes' }}
    />
    <Stack.Screen
      name="RecipeDetail"
      component={RecipeDetailScreen}
      options={{ title: 'Recipe Detail' }}
    />
    <Stack.Screen
      name="CreateRecipe"
      component={CreateRecipeScreen}
      options={{ title: 'Create Recipe' }}
    />
    <Stack.Screen
      name="EditRecipe"
      component={EditRecipeScreen}
      options={{ title: 'Edit Recipe' }}
    />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let name = 'home';
        if (route.name === 'Home') name = 'home';
        if (route.name === 'MyRecipes') name = 'book';
        if (route.name === 'Profile') name = 'person';
        return <Icon name={name} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#ff7043',
      tabBarInactiveTintColor: '#757575',
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen
      name="MyRecipes"
      component={MyRecipesScreen}
      options={{ title: 'My Recipes' }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const RootStack = createNativeStackNavigator();

const RootNavigation = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // yahan chahe to splash screen dikha sakte ho
    return null;
  }

  return (
    <NavigationContainer>
      {user ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="AppTabs" component={AppTabs} />
        </RootStack.Navigator>
      ) : (
        <RootStack.Navigator>
          <RootStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: 'Sign Up' }}
          />
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigation;
