import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useUIConfig } from "../context/UIConfigContext";
import type { Product } from "../types";
import { AppHeader } from "../components/AppHeader";

export function HomeScreen({
  onGoCart,
  onGoOrders,
  onGoLogin,
}: {
  onGoCart: () => void;
  onGoOrders: () => void;
  onGoLogin: () => void;
}) {
  const { user, logout } = useAuth();
  const { uiConfig } = useUIConfig();
  const {
    products,
    cart,
    isRefreshing,
    refreshAll,
    resetProducts,
    addItemToCart,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => ["전체", ...(uiConfig.featuredCategories ?? [])],
    [uiConfig.featuredCategories]
  );

  const filteredProducts = useMemo(() => {
    const list = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : products;
    return list;
  }, [products, selectedCategory]);

  const cartItemCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const onSearch = async () => {
    await refreshAll(searchQuery);
  };

  const renderProduct = ({ item }: { item: Product }) => {
    return (
      <View style={styles.productCard}>
        <View style={styles.productImageBox}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.productImage} />
          )}
        </View>
        <View style={styles.productBody}>
          <Text
            style={[styles.productCategory, { color: uiConfig.primaryColor }]}
          >
            {item.category}
          </Text>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.productDesc} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.productFooter}>
            <View>
              <Text style={styles.productPrice}>
                {item.price.toLocaleString()}원
              </Text>
              {uiConfig.showDiscount ? (
                <Text style={styles.productDiscount}>🔥 특가!</Text>
              ) : null}
            </View>
            <Pressable
              onPress={() => {
                if (!user) {
                  onGoLogin();
                  return;
                }
                addItemToCart(item);
              }}
              style={({ pressed }) => [
                styles.addCircle,
                {
                  backgroundColor: uiConfig.primaryColor,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={styles.addCircleText}>＋</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        current="home"
        headerMessage={uiConfig.headerMessage}
        primaryColor={uiConfig.primaryColor}
        cartItemCount={cartItemCount}
        userName={user?.name}
        onPressHome={async () => {
          setSelectedCategory(null);
          setSearchQuery("");
          await resetProducts();
        }}
        onPressOrders={onGoOrders}
        onPressCart={onGoCart}
        onPressLogin={onGoLogin}
        onPressLogout={() => {
          void logout().finally(onGoLogin);
        }}
      />

      {uiConfig.showDiscount ? (
        <View style={[styles.discountBanner]}>
          <Text style={styles.discountBannerText}>
            🎉 특별 할인 이벤트 진행중! 지금 바로 확인하세요!
          </Text>
        </View>
      ) : null}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>추천 카테고리</Text>
        <View style={styles.categoryWrap}>
          {categories.map((c) => {
            const active = (selectedCategory ?? "전체") === c;
            return (
              <Pressable
                key={c}
                onPress={() => setSelectedCategory(c === "전체" ? null : c)}
                style={({ pressed }) => [
                  styles.categoryBtn,
                  {
                    backgroundColor: active ? uiConfig.primaryColor : "#f3f4f6",
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryBtnText,
                    { color: active ? "#fff" : "#374151" },
                  ]}
                >
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>상품 검색</Text>
        <View style={styles.searchRow}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="검색어를 입력하세요 (예: '노트북', '가성비')"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={onSearch}
          />
          <Pressable
            onPress={onSearch}
            style={({ pressed }) => [
              styles.searchBtn,
              {
                backgroundColor: uiConfig.primaryColor,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={styles.searchBtnText}>
              {isRefreshing ? "..." : "검색"}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.searchHint}>
          * 서버 데이터베이스(SQLite)에서 상품을 검색합니다.
        </Text>
      </View>

      <Text style={styles.listTitle}>
        {selectedCategory
          ? `${selectedCategory} 카테고리`
          : searchQuery
          ? `'${searchQuery}' 검색 결과`
          : "전체 상품 목록"}
      </Text>

      {isRefreshing ? (
        <View style={styles.loading}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>불러오는 중…</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            {selectedCategory
              ? `${selectedCategory} 카테고리에 상품이 없습니다.`
              : "표시할 상품이 없습니다. 서버가 실행 중인지 확인해주세요."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(p) => p.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.grid}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          refreshing={isRefreshing}
          onRefresh={() => refreshAll(searchQuery)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },

  discountBanner: {
    margin: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#f59e0b",
  },
  discountBannerText: {
    color: "#fff",
    fontWeight: "900",
    textAlign: "center",
  },

  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 12,
  },

  categoryWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 },
  categoryBtnText: { fontWeight: "900" },

  searchRow: { flexDirection: "row", gap: 8 },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchBtn: {
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
  },
  searchBtnText: { color: "#fff", fontWeight: "900" },
  searchHint: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "700",
  },

  listTitle: {
    marginTop: 4,
    marginBottom: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },

  grid: { paddingHorizontal: 16, paddingBottom: 16 },
  gridRow: { justifyContent: "space-between" },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    marginBottom: 12,
  },
  productImageBox: { height: 120, backgroundColor: "#f3f4f6" },
  productImage: { width: "100%", height: "100%", backgroundColor: "#f3f4f6" },
  productBody: { padding: 12 },
  productCategory: { fontSize: 12, fontWeight: "900", marginBottom: 2 },
  productName: { fontSize: 15, fontWeight: "900", color: "#111827" },
  productDesc: {
    marginTop: 6,
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 16,
    minHeight: 32,
  },
  productFooter: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: { fontSize: 16, fontWeight: "900", color: "#111827" },
  productDiscount: {
    marginTop: 2,
    fontSize: 11,
    color: "#ef4444",
    fontWeight: "900",
  },
  addCircle: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  addCircleText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginTop: -2,
  },

  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 8, color: "#6b7280" },
  emptyBox: { padding: 24, alignItems: "center" },
  emptyText: { color: "#6b7280", fontWeight: "800", textAlign: "center" },
});
