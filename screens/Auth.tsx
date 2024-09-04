import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { supabase } from "../supabase/supabase-client";
import { Button, Input } from "react-native-elements";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function signInWithEmail() {
    if (!email || !password) {
      setMessage("Email and password cannot be empty.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) setMessage(error.message);

    setLoading(false);
  }

  async function signUpWithEmail() {
    if (!email || !password) {
      setMessage("Email and password cannot be empty.");
      return;
    }

    setLoading(true);
    setMessage("");

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) setMessage(error.message);

    if (!session) setMessage("Please check your inbox for email verification!");

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={signInWithEmail} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={signUpWithEmail} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
