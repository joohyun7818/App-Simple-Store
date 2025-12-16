/**
 * Optimizely 변수 사용 예시
 * 
 * 이 파일은 실제 코드에서 Optimizely 변수를 어떻게 사용하는지 보여주는 예시입니다.
 * 기존 코드를 Optimizely 변수로 전환하는 방법을 참고하세요.
 */

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  useUITheme,
  useDiscountPromotion,
  useCartCTA,
  useHeaderMessage,
  useProductGridLayout,
  useProductCardStyle,
  useFreeShipping,
} from "./useOptimizelyVariables";
import { useTrack } from "@optimizely/react-sdk";

/**
 * 예시 1: 홈 화면에서 UI 테마 및 할인 프로모션 사용
 */
export function HomeScreenExample() {
  const { primaryColor } = useUITheme();
  const { enabled, message } = useDiscountPromotion();
  const { message: headerMsg } = useHeaderMessage();
  const { columns, imageHeight } = useProductGridLayout();
  const { track } = useTrack();

  return (
    <View style={styles.container}>
      {/* 헤더 메시지 - Optimizely에서 제어 */}
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <Text style={styles.headerText}>{headerMsg}</Text>
      </View>

      {/* 할인 배너 - Optimizely에서 표시 여부 및 메시지 제어 */}
      {enabled && (
        <View style={styles.discountBanner}>
          <Text style={styles.discountText}>{message}</Text>
        </View>
      )}

      {/* 제품 그리드 - Optimizely에서 열 수와 이미지 높이 제어 */}
      <View>
        <Text>Grid Columns: {columns}</Text>
        <Text>Image Height: {imageHeight}px</Text>
      </View>
    </View>
  );
}

/**
 * 예시 2: 제품 카드에서 CTA 버튼 및 스타일 사용
 */
export function ProductCardExample({ product }: { product: any }) {
  const { primaryColor } = useUITheme();
  const { addToCartText } = useCartCTA();
  const { badgeText } = useDiscountPromotion();
  const { showDescription, borderRadius, showAddToCartIcon } =
    useProductCardStyle();
  const { track } = useTrack();

  const handleAddToCart = () => {
    // 장바구니 추가 로직
    console.log("Adding to cart:", product);

    // Optimizely 이벤트 추적
    track("add_to_cart", {
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category,
    });
  };

  return (
    <View style={[styles.productCard, { borderRadius }]}>
      <View style={styles.productImage}>
        {/* 제품 이미지 */}
        {product.onSale && <Text style={styles.badge}>{badgeText}</Text>}
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>

        {/* 제품 설명 - Optimizely에서 표시 여부 제어 */}
        {showDescription && (
          <Text style={styles.productDesc}>{product.description}</Text>
        )}

        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>
            {product.price.toLocaleString()}원
          </Text>

          {/* 장바구니 추가 버튼 - Optimizely에서 텍스트와 아이콘 제어 */}
          {showAddToCartIcon ? (
            <Pressable
              onPress={handleAddToCart}
              style={[styles.addButton, { backgroundColor: primaryColor }]}
            >
              <Text style={styles.addButtonText}>{addToCartText}</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleAddToCart}
              style={[styles.addButtonAlt, { borderColor: primaryColor }]}
            >
              <Text style={[styles.addButtonAltText, { color: primaryColor }]}>
                {addToCartText}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

/**
 * 예시 3: 장바구니 화면에서 CTA 및 무료 배송 표시
 */
export function CartScreenExample({ total }: { total: number }) {
  const { primaryColor } = useUITheme();
  const { checkoutButtonText, continueShoppingText } = useCartCTA();
  const { minAmount, showInfo } = useFreeShipping();
  const { track } = useTrack();

  const shippingFee = total >= minAmount ? 0 : 3000;
  const remainingForFreeShipping = minAmount > 0 ? minAmount - total : 0;

  const handleCheckout = () => {
    // 체크아웃 로직
    console.log("Proceeding to checkout");

    // Optimizely 이벤트 추적
    track("checkout", {
      cartTotal: total,
      shippingFee,
      finalTotal: total + shippingFee,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>주문 요약</Text>

        <View style={styles.summaryRow}>
          <Text>상품 금액</Text>
          <Text>{total.toLocaleString()}원</Text>
        </View>

        {/* 무료 배송 정보 - Optimizely에서 표시 여부 및 임계값 제어 */}
        {showInfo && minAmount > 0 && (
          <>
            <View style={styles.summaryRow}>
              <Text>배송비</Text>
              <Text>
                {shippingFee === 0
                  ? "무료"
                  : `${shippingFee.toLocaleString()}원`}
              </Text>
            </View>

            {remainingForFreeShipping > 0 && (
              <View style={styles.freeShippingInfo}>
                <Text style={styles.freeShippingText}>
                  {remainingForFreeShipping.toLocaleString()}원 더 담으면 무료
                  배송!
                </Text>
              </View>
            )}
          </>
        )}

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>총 결제 금액</Text>
          <Text style={[styles.totalValue, { color: primaryColor }]}>
            {(total + shippingFee).toLocaleString()}원
          </Text>
        </View>

        {/* 체크아웃 버튼 - Optimizely에서 텍스트 제어 */}
        <Pressable
          onPress={handleCheckout}
          style={[styles.checkoutButton, { backgroundColor: primaryColor }]}
        >
          <Text style={styles.checkoutButtonText}>{checkoutButtonText}</Text>
        </Pressable>

        {/* 쇼핑 계속하기 버튼 - Optimizely에서 텍스트 제어 */}
        <Pressable style={styles.continueButton}>
          <Text style={[styles.continueButtonText, { color: primaryColor }]}>
            {continueShoppingText}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * 예시 4: 사용자 속성 기반 타게팅
 * 
 * Optimizely는 사용자 속성을 기반으로 다른 경험을 제공할 수 있습니다.
 * 예: 국가별, 신규/기존 사용자, 구매 이력 등
 */
export function UserSegmentExample() {
  const { primaryColor } = useUITheme();
  const { track } = useTrack();

  // 사용자 속성은 optimizelyUser.ts의 toOptimizelyUser 함수에서 설정됩니다.
  // 현재 설정된 속성:
  // - is_logged_in: boolean
  // - email_domain: string (예: gmail.com)
  // - country: string (예: KR, US)

  // Optimizely 대시보드에서 이러한 속성을 기반으로 Audience를 만들 수 있습니다:
  // 예시:
  // - "한국 사용자": country == "KR"
  // - "Gmail 사용자": email_domain == "gmail.com"
  // - "로그인 사용자": is_logged_in == true

  return (
    <View>
      <Text style={{ color: primaryColor }}>
        사용자 세그먼트에 따라 다른 경험을 제공합니다.
      </Text>
    </View>
  );
}

/**
 * 예시 5: 이벤트 추적 통합 예시
 */
export function EventTrackingExample() {
  const { track } = useTrack();

  // 주요 이벤트 추적 함수들
  const trackProductView = (product: any) => {
    track("product_view", {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
    });
  };

  const trackCategoryClick = (category: string) => {
    track("category_click", {
      category,
      timestamp: Date.now(),
    });
  };

  const trackSearch = (query: string, resultCount: number) => {
    track("search", {
      query,
      resultCount,
    });
  };

  const trackPurchase = (order: any) => {
    track("purchase", {
      orderId: order.id,
      total: order.total,
      itemCount: order.items.length,
      revenue: order.total,
    });
  };

  return (
    <View>
      <Text>이벤트 추적 예시</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    padding: 16,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  discountBanner: {
    margin: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#f59e0b",
  },
  discountText: {
    color: "#fff",
    fontWeight: "900",
    textAlign: "center",
  },
  productCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  productImage: {
    height: 120,
    backgroundColor: "#f3f4f6",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ef4444",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: "900",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
  },
  productCategory: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  productDesc: {
    marginTop: 6,
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 16,
  },
  productFooter: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  addButtonAlt: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  addButtonAltText: {
    fontSize: 13,
    fontWeight: "900",
  },
  summary: {
    padding: 16,
    backgroundColor: "#fff",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  freeShippingInfo: {
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  freeShippingText: {
    color: "#92400e",
    fontWeight: "900",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "900",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
  },
  checkoutButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  continueButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: "900",
  },
});
