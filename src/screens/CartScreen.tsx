import React, { useMemo } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTrackEvent } from "@optimizely/react-sdk";
import { useStore } from "../context/StoreContext";
import { useUIConfig } from "../context/UIConfigContext";
import type { CartItem } from "../types";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import { useCheckoutButton } from "../optimizely/useOptimizelyVariables";

export function CartScreen({
  onGoHome,
  onGoOrders,
  onGoLogin,
}: {
  onGoHome: () => void;
  onGoOrders: () => void;
  onGoLogin: () => void;
}) {
  const { uiConfig } = useUIConfig();
  const { user, logout } = useAuth();
  const { cart, resetProducts, changeQuantity, removeItemFromCart, checkout } =
    useStore();
  const [trackEvent, clientReady] = useTrackEvent();
  const { checkoutButtonText, variationKey, isEnabled } = useCheckoutButton();

  const cartItemCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const renderItem = ({ item }: { item: CartItem }) => {
    return (
      <View style={styles.item}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemMeta}>{item.category}</Text>
          <Text style={styles.itemPrice}>{item.price.toLocaleString()}원</Text>
        </View>
        <View style={styles.itemActions}>
          <View style={styles.qtyRow}>
            <Pressable
              onPress={() => changeQuantity(item.id, -1)}
              style={({ pressed }) => [
                styles.qtyBtn,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </Pressable>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <Pressable
              onPress={() => changeQuantity(item.id, 1)}
              style={({ pressed }) => [
                styles.qtyBtn,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              Alert.alert("삭제", "장바구니에서 제거할까요?", [
                { text: "취소", style: "cancel" },
                {
                  text: "삭제",
                  style: "destructive",
                  onPress: () => removeItemFromCart(item.id),
                },
              ]);
            }}
            style={({ pressed }) => [
              styles.removeBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={styles.removeBtnText}>삭제</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <AppHeader
          current="cart"
          headerMessage={uiConfig.headerMessage}
          primaryColor={uiConfig.primaryColor}
          cartItemCount={cartItemCount}
          onPressHome={() => {
            void resetProducts().finally(onGoHome);
          }}
          onPressOrders={onGoOrders}
          onPressCart={() => undefined}
          onPressLogin={onGoLogin}
          onPressLogout={() => {
            void logout().finally(onGoLogin);
          }}
        />

        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>로그인이 필요합니다</Text>
          <Text style={styles.emptySub}>장바구니를 보려면 로그인해주세요.</Text>
          <Pressable
            onPress={onGoLogin}
            style={({ pressed }) => [
              styles.primary,
              {
                backgroundColor: uiConfig.primaryColor,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={styles.primaryText}>로그인</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader
          current="cart"
          headerMessage={uiConfig.headerMessage}
          primaryColor={uiConfig.primaryColor}
          cartItemCount={cartItemCount}
          userName={user.name}
          onPressHome={() => {
            void resetProducts().finally(onGoHome);
          }}
          onPressOrders={onGoOrders}
          onPressCart={() => undefined}
          onPressLogin={onGoLogin}
          onPressLogout={() => {
            void logout().finally(onGoLogin);
          }}
        />

        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>장바구니가 비어있습니다</Text>
          <Text style={styles.emptySub}>원하는 상품을 담아보세요.</Text>
          <Pressable
            onPress={onGoHome}
            style={({ pressed }) => [
              styles.primary,
              {
                backgroundColor: uiConfig.primaryColor,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={styles.primaryText}>쇼핑 계속하기</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        current="cart"
        headerMessage={uiConfig.headerMessage}
        primaryColor={uiConfig.primaryColor}
        cartItemCount={cartItemCount}
        userName={user.name}
        onPressHome={() => {
          void resetProducts().finally(onGoHome);
        }}
        onPressOrders={onGoOrders}
        onPressCart={() => undefined}
        onPressLogin={onGoLogin}
        onPressLogout={() => {
          void logout().finally(onGoLogin);
        }}
      />

      <View style={styles.page}>
        <Text style={styles.title}>장바구니</Text>

        <FlatList
          data={cart}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>결제 정보</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryMuted}>총 상품금액</Text>
            <Text style={styles.summaryMuted}>{total.toLocaleString()}원</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryMuted}>배송비</Text>
            <Text style={styles.summaryMuted}>무료</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>총 결제금액</Text>
            <Text
              style={[styles.summaryValue, { color: uiConfig.primaryColor }]}
            >
              {total.toLocaleString()}원
            </Text>
          </View>
          <Pressable
            onPress={async () => {
              try {
                if (clientReady) {
                  trackEvent("order_placed", {
                    buttonText: checkoutButtonText,
                    variationKey,
                    flagEnabled: isEnabled,
                    cartItemCount,
                    cartTotal: total,
                  });
                }
              } catch {
                // ignore tracking errors; checkout should still proceed
              }
              await checkout();
              onGoOrders();
            }}
            style={({ pressed }) => [
              styles.primary,
              {
                backgroundColor: uiConfig.primaryColor,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={styles.primaryText}>{checkoutButtonText}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  page: { flex: 1 },
  title: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  item: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "900", color: "#111827" },
  itemMeta: { marginTop: 4, color: "#6b7280" },
  itemPrice: { marginTop: 8, fontWeight: "900", color: "#111827" },
  itemActions: { alignItems: "flex-end", justifyContent: "space-between" },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { fontSize: 18, fontWeight: "900", color: "#111827" },
  qtyText: {
    width: 24,
    textAlign: "center",
    fontWeight: "900",
    color: "#111827",
  },
  removeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  removeBtnText: { color: "#ef4444", fontWeight: "900" },
  summary: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 12,
  },
  summaryMuted: { color: "#6b7280", fontWeight: "800" },
  divider: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 12 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: { fontWeight: "900", color: "#111827" },
  summaryValue: { fontWeight: "900", fontSize: 18 },
  primary: { paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  primaryText: { color: "#fff", fontWeight: "900" },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f3f4f6",
  },
  emptyTitle: { fontSize: 20, fontWeight: "900", color: "#111827" },
  emptySub: { marginTop: 8, marginBottom: 16, color: "#6b7280" },
});
