import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "tamagui";

type LoginResponse = {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

export default function LoginPage() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<LoginResponse | null>(null);

  async function handleLogin() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 30,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data);
      router.replace("/test");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  if (user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-6">
        <Text className="mb-2 text-2xl font-bold">
          Welcome, {user.username}!
        </Text>

        <Text className="text-gray-600">{user.email}</Text>

        <Text className="mt-6 text-center text-green-600">
          Login successful
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-center px-6">
      <Text className="mb-2 text-3xl text-white font-bold">Welcome!</Text>

      <TextInput
        className="mb-4 rounded-xl border border-gray-300 px-4 py-3 text-base"
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <Input size="$4" borderWidth={2} />
      <TextInput
        className="mb-4 rounded-xl border border-gray-300 px-4 py-3 text-base"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text className="mb-4 text-red-500">{error}</Text> : null}

      <Pressable
        className="items-center rounded-xl bg-blue-600 py-4 active:bg-blue-700"
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <Text className="font-bold text-white">Login</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}
