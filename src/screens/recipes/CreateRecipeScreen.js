// import React, { useContext, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import client from '../../api/client';
// import { AuthContext } from '../../context/AuthContext';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// const CreateRecipeScreen = ({ navigation }) => {
//   const { user } = useContext(AuthContext);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('breakfast');
//   const [ingredientsText, setIngredientsText] = useState('');
//   const [instructions, setInstructions] = useState('');
//   const [image, setImage] = useState('');

//   const parseIngredients = () =>
//     ingredientsText
//       .split('\n')
//       .map((line) => line.trim())
//       .filter(Boolean)
//       .map((line) => {
//         const [name, quantity] = line.split('-');
//         return { name: name?.trim(), quantity: (quantity || '').trim() };
//       });

//   const onSave = async () => {
//     if (!title || !description || !instructions) {
//       Alert.alert('Error', 'Please fill required fields');
//       return;
//     }

//     const newRecipe = {
//       title,
//       description,
//       category,
//       instructions,
//       ingredients: parseIngredients(),
//       image,
//       userId: user.id,
//       likes: [],
//     };

//     try {
//       await client.post('/recipes', newRecipe);
//       navigation.goBack();
//     } catch (e) {
//       console.log('Save error', e);
//     }
//   };

//   const chooseImage = () => {
//     Alert.alert('Add Image', 'Select source', [
//       {
//         text: 'Camera',
//         onPress: async () => {
//           const res = await launchCamera({ mediaType: 'photo', quality: 0.8 });
//           const uri = res.assets?.[0]?.uri;
//           if (uri) setImage(uri);
//         },
//       },
//       {
//         text: 'Gallery',
//         onPress: async () => {
//           const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
//           const uri = res.assets?.[0]?.uri;
//           if (uri) setImage(uri);
//         },
//       },
//       { text: 'Cancel', style: 'cancel' },
//     ]);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.label}>Title</Text>
//       <TextInput value={title} onChangeText={setTitle} style={styles.input} />

//       <Text style={styles.label}>Short Description</Text>
//       <TextInput
//         value={description}
//         onChangeText={setDescription}
//         style={styles.input}
//         multiline
//       />

//       <Text style={styles.label}>Category</Text>
//       <View style={styles.chipRow}>
//         {['breakfast', 'lunch', 'dinner'].map((c) => (
//           <TouchableOpacity
//             key={c}
//             style={[styles.chip, category === c && styles.chipActive]}
//             onPress={() => setCategory(c)}
//           >
//             <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
//               {c.charAt(0).toUpperCase() + c.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <Text style={styles.label}>Ingredients (one per line: name - quantity)</Text>
//       <TextInput
//         value={ingredientsText}
//         onChangeText={setIngredientsText}
//         style={[styles.input, { height: 100 }]}
//         multiline
//       />

//       <Text style={styles.label}>Instructions</Text>
//       <TextInput
//         value={instructions}
//         onChangeText={setInstructions}
//         style={[styles.input, { height: 120 }]}
//         multiline
//       />

//       <Text style={styles.label}>Image</Text>
//       <TouchableOpacity style={styles.imageBtn} onPress={chooseImage}>
//         <Icon name="image" size={20} color="#ff7043" />
//         <Text style={styles.imageBtnText}>
//           {image ? 'Change Image' : 'Add from Camera / Gallery'}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
//         <Text style={styles.saveText}>Save Recipe</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default CreateRecipeScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//   label: { fontSize: 14, color: '#555', marginTop: 12, marginBottom: 4 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 12,
//     padding: 10,
//     backgroundColor: '#fafafa',
//   },
//   chipRow: { flexDirection: 'row', marginTop: 4 },
//   chip: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 20,
//     backgroundColor: '#eee',
//     marginRight: 8,
//   },
//   chipActive: { backgroundColor: '#ffccbc' },
//   chipText: { fontSize: 12, color: '#555' },
//   chipTextActive: { color: '#ff7043', fontWeight: '700' },
//   imageBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 12,
//     backgroundColor: '#fff3e0',
//     marginTop: 4,
//   },
//   imageBtnText: { marginLeft: 8, color: '#ff7043', fontWeight: '600' },
//   saveBtn: {
//     backgroundColor: '#ff7043',
//     paddingVertical: 14,
//     borderRadius: 14,
//     alignItems: 'center',
//     marginTop: 24,
//     marginBottom: 24,
//   },
//   saveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
// });




import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import client from '../../api/client';
import { AuthContext } from '../../context/AuthContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const CreateRecipeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('breakfast');
  const [ingredientsText, setIngredientsText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState('');

  const parseIngredients = () =>
    ingredientsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [name, quantity] = line.split('-');
        return {name: name?.trim(), quantity: (quantity || '').trim()};
      });

  // 👇 runtime camera permission
  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'We need access to your camera to take recipe photos.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission error', err);
      return false;
    }
  };

  const onSave = async () => {
    if (!title || !description || !instructions) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    const newRecipe = {
      title,
      description,
      category,
      instructions,
      ingredients: parseIngredients(),
      image,
      userId: user.id,
      likes: [],
    };

    try {
      await client.post('/recipes', newRecipe);
      navigation.goBack();
    } catch (e) {
      console.log('Save error', e);
      Alert.alert('Error', 'Failed to save recipe');
    }
  };

  const chooseImage = () => {
    Alert.alert('Add Image', 'Select source', [
      {
        text: 'Camera',
        onPress: async () => {
          const ok = await requestCameraPermission();
          if (!ok) {
            Alert.alert('Permission denied', 'Cannot open camera without permission');
            return;
          }
          const res = await launchCamera({
            mediaType: 'photo',
            quality: 0.8,
            saveToPhotos: true,
          });
          if (res.didCancel) {
            console.log('User cancelled camera');
            return;
          }
          if (res.errorCode) {
            console.log('Camera error', res.errorCode, res.errorMessage);
            Alert.alert('Camera error', res.errorMessage || 'Unable to open camera');
            return;
          }
          const uri = res.assets?.[0]?.uri;
          if (uri) setImage(uri);
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const res = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
          });
          if (res.didCancel) {
            console.log('User cancelled gallery');
            return;
          }
          if (res.errorCode) {
            console.log('Gallery error', res.errorCode, res.errorMessage);
            Alert.alert('Gallery error', res.errorMessage || 'Unable to open gallery');
            return;
          }
          const uri = res.assets?.[0]?.uri;
          if (uri) setImage(uri);
        },
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Short Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.chipRow}>
        {['breakfast', 'lunch', 'dinner'].map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, category === c && styles.chipActive]}
            onPress={() => setCategory(c)}>
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>
        Ingredients (one per line: name - quantity)
      </Text>
      <TextInput
        value={ingredientsText}
        onChangeText={setIngredientsText}
        style={[styles.input, {height: 100}]}
        multiline
      />

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        value={instructions}
        onChangeText={setInstructions}
        style={[styles.input, {height: 120}]}
        multiline
      />

      <Text style={styles.label}>Image</Text>
      <TouchableOpacity style={styles.imageBtn} onPress={chooseImage}>
        <Icon name="image" size={20} color="#ff7043" />
        <Text style={styles.imageBtnText}>
          {image ? 'Change Image' : 'Add from Camera / Gallery'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
        <Text style={styles.saveText}>Save Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateRecipeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  label: {fontSize: 14, color: '#555', marginTop: 12, marginBottom: 4},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fafafa',
  },
  chipRow: {flexDirection: 'row', marginTop: 4},
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  chipActive: {backgroundColor: '#ffccbc'},
  chipText: {fontSize: 12, color: '#555'},
  chipTextActive: {color: '#ff7043', fontWeight: '700'},
  imageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff3e0',
    marginTop: 4,
  },
  imageBtnText: {marginLeft: 8, color: '#ff7043', fontWeight: '600'},
  saveBtn: {
    backgroundColor: '#ff7043',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  saveText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});
