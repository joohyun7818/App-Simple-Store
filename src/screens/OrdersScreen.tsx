import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useStore } from "../context/StoreContext";
import { useUIConfig } from "../context/UIConfigContext";
import type { Order } from "../types";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";

export function OrdersScreen({
  onGoHome,
  onGoCart,
  onGoLogin,
}: {
  onGoHome: () => void;
  onGoCart: () => void;
  onGoLogin: () => void;
}) {
  const { uiConfig } = useUIConfig();
  const { user, logout } = useAuth();
  const { cart, orders, resetProducts } = useStore();

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const statusLabel = (status: Order["status"]) => {
    if (status === "processing") return "배송 준비중";
    if (status === "shipped") return "배송중";
    if (status === "delivered") return "배송 완료";
    return status;
  };

  const renderOrder = ({ item }: { item: Order }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.metaLabel}>주문 날짜</Text>
            <Text style={styles.metaValue}>
              {new Date(item.date).toLocaleString()}
            </Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>주문 번호</Text>
            <Text style={styles.metaValue}>#{item.id}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>총 결제금액</Text>
            <Text style={[styles.metaValue, { color: uiConfig.primaryColor }]}>
              {item.total.toLocaleString()}원
            </Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{statusLabel(item.status)}</Text>
          </View>
        </View>

        <View style={styles.itemsBox}>
          {item.items.map((it, idx) => (
            <View key={`${item.id}-${idx}`} style={styles.itemRow}>
              {it.imageUrl ? (
                <Image
                  source={{ uri: it.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {it.name}
                </Text>
                <Text style={styles.itemMeta}>{it.category}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemPrice}>
                  {it.price.toLocaleString()}원
                </Text>
                <Text style={styles.itemQty}>{it.quantity}개</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <AppHeader
          current="orders"
          headerMessage={uiConfig.headerMessage}
          primaryColor={uiConfig.primaryColor}
          cartItemCount={cartItemCount}
          onPressHome={() => {
            void resetProducts().finally(onGoHome);
          }}
          onPressOrders={() => undefined}
          onPressCart={onGoCart}
          onPressLogin={onGoLogin}
          onPressLogout={() => {
            void logout().finally(onGoLogin);
          }}
        />

        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>로그인이 필요합니다</Text>
          <Text style={styles.emptySub}>
            주문 내역을 보려면 로그인해주세요.
          </Text>
          <Pressable onPress={onGoLogin} style={styles.linkBtn}>
            <Text style={[styles.linkText, { color: uiConfig.primaryColor }]}>
              로그인
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader
          current="orders"
          headerMessage={uiConfig.headerMessage}
          primaryColor={uiConfig.primaryColor}
          cartItemCount={cartItemCount}
          userName={user.name}
          onPressHome={() => {
            void resetProducts().finally(onGoHome);
          }}
          onPressOrders={() => undefined}
          onPressCart={onGoCart}
          onPressLogin={onGoLogin}
          onPressLogout={() => {
            void logout().finally(onGoLogin);
          }}
        />

        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>주문 내역이 없습니다</Text>
          <Text style={styles.emptySub}>아직 주문하신 상품이 없습니다.</Text>
          <Pressable onPress={onGoHome} style={styles.linkBtn}>
            <Text style={[styles.linkText, { color: uiConfig.primaryColor }]}>
              쇼핑하러 가기
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        current="orders"
        headerMessage={uiConfig.headerMessage}
        primaryColor={uiConfig.primaryColor}
        cartItemCount={cartItemCount}
        userName={user.name}
        onPressHome={() => {
          void resetProducts().finally(onGoHome);
        }}
        onPressOrders={() => undefined}
        onPressCart={onGoCart}
        onPressLogin={onGoLogin}
        onPressLogout={() => {
          void logout().finally(onGoLogin);
        }}
      />

      <Text style={styles.title}>주문 내역</Text>

      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  linkBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  linkText: { fontWeight: "900" },
  title: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
    overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  metaLabel: { fontSize: 12, fontWeight: "900", color: "#6b7280" },
  metaValue: { marginTop: 3, fontWeight: "800", color: "#111827" },
  statusPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#dcfce7",
    alignSelf: "center",
  },
  statusText: { color: "#15803d", fontWeight: "900" },
  itemsBox: { borderTopWidth: 1, borderTopColor: "#e5e7eb" },
  itemRow: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  itemName: { fontWeight: "900", color: "#111827" },
  itemMeta: { marginTop: 4, color: "#6b7280" },
  itemRight: { alignItems: "flex-end" },
  itemPrice: { fontWeight: "900", color: "#111827" },
  itemQty: { marginTop: 4, color: "#6b7280", fontWeight: "800" },
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
