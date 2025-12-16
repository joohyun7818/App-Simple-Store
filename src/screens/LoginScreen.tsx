import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useUIConfig } from "../context/UIConfigContext";
import { AppHeader } from "../components/AppHeader";

export function LoginScreen({
  onDone,
  onGoHome,
}: {
  onDone?: () => void;
  onGoHome?: () => void;
}) {
  const { login, register } = useAuth();
  const { uiConfig } = useUIConfig();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === "login";

  const canSubmit = useMemo(() => {
    if (!email || !password) return false;
    if (!isLogin && !name) return false;
    return true;
  }, [email, password, name, isLogin]);

  const onSubmit = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    try {
      if (isLogin) {
        const ok = await login(email.trim(), password);
        if (ok) onDone?.();
      } else {
        const ok = await register(email.trim(), name.trim(), password);
        if (ok) onDone?.();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <AppHeader
        current="login"
        headerMessage={uiConfig.headerMessage}
        primaryColor={uiConfig.primaryColor}
        cartItemCount={0}
        onPressHome={() => onGoHome?.()}
        onPressOrders={() => undefined}
        onPressCart={() => undefined}
        onPressLogin={() => undefined}
        onPressLogout={() => undefined}
      />

      <View style={styles.container}>
        <View style={styles.card}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${uiConfig.primaryColor}20` },
            ]}
          >
            <Text style={[styles.iconText, { color: uiConfig.primaryColor }]}>
              🔒
            </Text>
          </View>
          <Text style={styles.title}>{isLogin ? "로그인" : "회원가입"}</Text>
          <Text style={styles.subtitle}>
            {isLogin
              ? "서비스 이용을 위해 로그인해주세요"
              : "새로운 계정을 생성하세요"}
          </Text>

          {!isLogin && (
            <View style={styles.field}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="홍길동"
                autoCapitalize="none"
                style={[
                  styles.input,
                  { borderColor: name ? uiConfig.primaryColor : "#d1d5db" },
                ]}
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              style={[
                styles.input,
                { borderColor: email ? uiConfig.primaryColor : "#d1d5db" },
              ]}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              style={[
                styles.input,
                { borderColor: password ? uiConfig.primaryColor : "#d1d5db" },
              ]}
            />
          </View>

          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit || isLoading}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: uiConfig.primaryColor,
                opacity: !canSubmit || isLoading ? 0.6 : pressed ? 0.8 : 1,
              },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isLogin ? "로그인" : "가입하기"}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setMode(isLogin ? "register" : "login");
              setEmail("");
              setPassword("");
              setName("");
            }}
            style={styles.linkButton}
          >
            <Text style={[styles.linkText, { color: uiConfig.primaryColor }]}>
              {isLogin
                ? "계정이 없으신가요? 회원가입"
                : "이미 계정이 있으신가요? 로그인"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f3f4f6" },
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 14,
  },
  iconText: {
    fontSize: 28,
    fontWeight: "900",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  field: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    color: "#374151",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  linkButton: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 8,
  },
  linkText: {
    fontWeight: "700",
  },
});
