// import React, { useContext, useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { AuthContext } from '../../context/AuthContext';

// const SignupScreen = ({ navigation }) => {
//   const { signup } = useContext(AuthContext);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');

//   const onSignup = async () => {
//     if (!name || !email || !password || !confirm) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }
//     if (password !== confirm) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }
//     try {
//       await signup({ name, email, password });
//     } catch (e) {
//       Alert.alert('Signup failed', e.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Account 👩‍🍳</Text>

//       <TextInput
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         style={styles.input}
//         secureTextEntry
//       />
//       <TextInput
//         placeholder="Confirm Password"
//         value={confirm}
//         onChangeText={setConfirm}
//         style={styles.input}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.button} onPress={onSignup}>
//         <Text style={styles.buttonText}>Sign Up</Text>
//       </TouchableOpacity>

//       <View style={styles.row}>
//         <Text>Already have an account? </Text>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.link}>Login</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default SignupScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
//   title: { fontSize: 28, fontWeight: '700', marginBottom: 24, color: '#333' },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     backgroundColor: '#fafafa',
//   },
//   button: {
//     backgroundColor: '#ff7043',
//     padding: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   row: { flexDirection: 'row', marginTop: 16, justifyContent: 'center' },
//   link: { color: '#ff7043', fontWeight: '600' },
// });




import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);
const hasUppercase = (value) => /[A-Z]/.test(value);
const hasNumber = (value) => /\d/.test(value);
const hasSpecialChar = (value) => /[^A-Za-z0-9]/.test(value);
const isStrongPassword = (value) =>
  value.length >= 6 && hasUppercase(value) && hasNumber(value) && hasSpecialChar(value);

const SignupScreen = ({ navigation }) => {
  const { signup, logout } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const handleNameChange = (value) => {
    setName(value);
    const trimmed = value.trim();
    if (!trimmed) {
      setNameError('Name is required');
    } else if (trimmed.length < 5 || trimmed.length > 30) {
      setNameError('Name must be between 5 and 30 characters');
    } else {
      setNameError('');
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    const trimmed = value.trim();
    if (!trimmed) {
      setEmailError('Email is required');
    } else if (!isValidEmail(trimmed)) {
      setEmailError('Enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    const trimmed = value.trim();
    if (!trimmed) {
      setPasswordError('Password is required');
    } else if (!isStrongPassword(trimmed)) {
      setPasswordError(
        'Min 6 chars, include 1 capital letter, 1 number & 1 special character',
      );
    } else {
      setPasswordError('');
    }

    // Also re-validate confirm password when main password changes
    if (confirm) {
      if (trimmed !== confirm.trim()) {
        setConfirmError('Passwords do not match');
      } else {
        setConfirmError('');
      }
    }
  };

  const handleConfirmChange = (value) => {
    setConfirm(value);
    const trimmed = value.trim();
    if (!trimmed) {
      setConfirmError('Confirm password is required');
    } else if (trimmed !== password.trim()) {
      setConfirmError('Passwords do not match');
    } else {
      setConfirmError('');
    }
  };

  const onSignup = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirm.trim();

    // Run validations one more time before submit
    handleNameChange(trimmedName);
    handleEmailChange(trimmedEmail);
    handlePasswordChange(trimmedPassword);
    handleConfirmChange(trimmedConfirm);

    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPassword ||
      !trimmedConfirm ||
      nameError ||
      emailError ||
      passwordError ||
      confirmError
    ) {
      Alert.alert('Error', 'Please fix the errors before signing up');
      return;
    }

    try {
      setSubmitting(true);
      await signup({ name: trimmedName, email: trimmedEmail, password: trimmedPassword });

      // signup ke baad context user ko login kar deta hai, lekin tumne bola tha
      // "success message dikha kar login per redirect" – isliye hum logout karke login screen pe bhej rahe hain
      await logout();

      Alert.alert(
        'Success',
        'Account created successfully. Please login with your credentials.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack(); // Login screen pe wapas
            },
          },
        ],
      );
    } catch (e) {
      Alert.alert('Signup failed', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    name &&
    email &&
    password &&
    confirm &&
    !nameError &&
    !emailError &&
    !passwordError &&
    !confirmError;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 👩‍🍳</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={handleNameChange}
        style={styles.input}
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        style={styles.input}
        secureTextEntry
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TextInput
        placeholder="Confirm Password"
        value={confirm}
        onChangeText={handleConfirmChange}
        style={styles.input}
        secureTextEntry
      />
      {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}

      <TouchableOpacity
        style={[styles.button, (!isFormValid || submitting) && { opacity: 0.6 }]}
        onPress={onSignup}
        disabled={!isFormValid || submitting}
      >
        <Text style={styles.buttonText}>{submitting ? 'Signing up...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
    backgroundColor: '#fafafa',
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#ff7043',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  row: { flexDirection: 'row', marginTop: 16, justifyContent: 'center' },
  link: { color: '#ff7043', fontWeight: '600' },
});
