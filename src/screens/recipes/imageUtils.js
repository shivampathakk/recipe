// src/screens/recipes/imageUtils.js (optional helper)
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export const pickImageFromLibrary = () =>
  launchImageLibrary({ mediaType: 'photo', quality: 0.8 });

export const pickImageFromCamera = () =>
  launchCamera({ mediaType: 'photo', quality: 0.8 });
