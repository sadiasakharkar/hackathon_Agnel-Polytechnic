import { StyleSheet, Platform } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'flex-start', // Content starts at the top
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 30, // Adjust for Android status bar
  },
  title: {
    fontSize: 32, // Larger for emphasis
    fontWeight: 'bold',
    color: '#4F46E5',
    textAlign: 'center',
    marginBottom: 30, // Extra space for better separation
  },
  label: {
    fontSize: 16,
    color: '#6b7280',
    alignSelf: 'flex-start', // Aligns to the left for readability
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    
  },
});
