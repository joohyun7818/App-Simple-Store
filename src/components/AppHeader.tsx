import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type AppHeaderRoute = "home" | "cart" | "orders" | "login";

export function AppHeader({
  current,
  headerMessage,
  primaryColor,
  cartItemCount,
  userName,
  onPressHome,
  onPressCart,
  onPressOrders,
  onPressLogin,
  onPressLogout,
}: {
  current: AppHeaderRoute;
  headerMessage: string;
  primaryColor: string;
  cartItemCount: number;
  userName?: string;
  onPressHome: () => void;
  onPressCart: () => void;
  onPressOrders: () => void;
  onPressLogin: () => void;
  onPressLogout: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: primaryColor, paddingTop: insets.top + 10 },
      ]}
    >
      <View style={styles.inner}>
        <Pressable onPress={onPressHome} style={styles.brand}>
          <Text style={styles.brandText} numberOfLines={1}>
            {headerMessage}
          </Text>
        </Pressable>

        <View style={styles.navRow}>
          <Pressable onPress={onPressHome} style={styles.navBtn}>
            <Text
              style={[
                styles.navText,
                current === "home" ? styles.navActive : styles.navInactive,
              ]}
            >
              상품 목록
            </Text>
          </Pressable>

          {!!userName && (
            <>
              <Pressable onPress={onPressOrders} style={styles.navBtn}>
                <Text
                  style={[
                    styles.navText,
                    current === "orders"
                      ? styles.navActive
                      : styles.navInactive,
                  ]}
                >
                  주문 내역
                </Text>
              </Pressable>

              <Pressable onPress={onPressCart} style={styles.cartBtn}>
                <Text
                  style={[
                    styles.navText,
                    current === "cart" ? styles.navActive : styles.navInactive,
                  ]}
                >
                  장바구니
                </Text>
                {cartItemCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartItemCount}</Text>
                  </View>
                ) : null}
              </Pressable>

              <View style={styles.userBox}>
                <Text style={styles.userText} numberOfLines={1}>
                  {userName}님
                </Text>
                <Pressable onPress={onPressLogout} style={styles.logoutBtn}>
                  <Text style={styles.logoutText}>로그아웃</Text>
                </Pressable>
              </View>
            </>
          )}

          {!userName ? (
            <Pressable onPress={onPressLogin} style={styles.loginBtn}>
              <Text style={styles.loginText}>로그인</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  brand: {
    flex: 1,
    paddingVertical: 6,
    paddingRight: 8,
  },
  brandText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  navText: {
    fontSize: 13,
  },
  navActive: {
    color: "#ffffff",
    fontWeight: "900",
  },
  navInactive: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "800",
  },
  cartBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
  },
  userBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.35)",
  },
  userText: {
    maxWidth: 90,
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "800",
  },
  logoutBtn: {
    backgroundColor: "rgba(0,0,0,0.18)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
  },
  loginBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  loginText: {
    color: "#fff",
    fontWeight: "900",
  },
});
