import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F7F5F2',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#5B5B5B',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#3B3B3B',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D4CEC3',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  helper: {
    fontSize: 12,
    color: '#6F6F6F',
    marginTop: -10,
    marginBottom: 16,
  },
  error: {
    color: '#B00020',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1B6E5A',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  link: {
    color: '#1B4D89',
    textAlign: 'center',
    marginTop: 12,
  },
});
