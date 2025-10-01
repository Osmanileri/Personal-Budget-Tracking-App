import { useEffect } from 'react';
import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { BudgetProvider } from '@/context/BudgetContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';

// Function for initial database setup and table creation
const createDbIfNeeded = async (db: SQLiteDatabase) => {
  console.log('Creating database');
  try {
    // Create transactions table
    console.log('Creating transactions table');
    // Use the BudgetEntry type to define columns
    await db.execAsync(
      'CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, amount INTEGER, category TEXT, description TEXT, date TEXT, type TEXT);'
    );

    // Create users table
    console.log('Creating users table');
    await db.execAsync(
      'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT);'
    );
  } catch (error) {
    console.error('Error creating database:', error);
  }
};

// Main protected layout (requires authentication)
function ProtectedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

// Root layout of the app, wraps providers and main layout
export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    // SQLiteProvider: handles database connection and initial setup
    <SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
      {/* AuthProvider: handles user authentication */}
      <AuthProvider>
        {/* BudgetProvider: handles budget and transaction state */}
        <BudgetProvider>
          {/* ProtectedLayout: main screens if authenticated */}
          <ProtectedLayout />
          <StatusBar style="auto" />
        </BudgetProvider>
      </AuthProvider>
    </SQLiteProvider>
  );
}
