import { useDecision } from "@optimizely/react-sdk";
import { useMemo } from "react";
import {
  FEATURE_FLAGS,
  VARIABLE_KEYS,
  DEFAULT_VALUES,
} from "./optimizelyVariables";

/**
 * UI 테마 변수를 가져오는 훅
 */
export function useUITheme() {
  const [decision] = useDecision(FEATURE_FLAGS.UI_THEME_EXPERIMENT);

  return useMemo(() => {
    const variables = decision.variables as Record<string, unknown>;
    
    return {
      primaryColor:
        (variables[VARIABLE_KEYS.PRIMARY_COLOR] as string) ??
        DEFAULT_VALUES[VARIABLE_KEYS.PRIMARY_COLOR],
      themeName:
        (variables[VARIABLE_KEYS.THEME_NAME] as string) ??
        DEFAULT_VALUES[VARIABLE_KEYS.THEME_NAME],
    };
  }, [decision]);
}

/**
 * 할인 프로모션 변수를 가져오는 훅
 */
export function useDiscountPromotion() {
  const [decision] = useDecision(FEATURE_FLAGS.SHOW_DISCOUNT_BANNER);

  return useMemo(() => {
    const variables = decision.variables as Record<string, unknown>;
    
    return {
      enabled:
        (variables[VARIABLE_KEYS.DISCOUNT_ENABLED] as boolean) ??
        DEFAULT_VALUES[VARIABLE_KEYS.DISCOUNT_ENABLED],
      message:
        (variables[VARIABLE_KEYS.DISCOUNT_MESSAGE] as string) ??
        DEFAULT_VALUES[VARIABLE_KEYS.DISCOUNT_MESSAGE],
      badgeText:
        (variables[VARIABLE_KEYS.DISCOUNT_BADGE_TEXT] as string) ??
        DEFAULT_VALUES[VARIABLE_KEYS.DISCOUNT_BADGE_TEXT],
    };
  }, [decision]);
}

/**
 * 제품 그리드 레이아웃 변수를 가져오는 훅
 */
export function useProductGridLayout() {
  const [decision] = useDecision(FEATURE_FLAGS.PRODUCT_GRID_LAYOUT);

  return useMemo(() => {
    const variables = decision.variables as Record<string, unknown>;
    
    return {
      columns:
        (variables[VARIABLE_KEYS.GRID_COLUMNS] as number) ??
        DEFAULT_VALUES[VARIABLE_KEYS.GRID_COLUMNS],
      imageHeight:
        (variables[VARIABLE_KEYS.PRODUCT_IMAGE_HEIGHT] as number) ??
        DEFAULT_VALUES[VARIABLE_KEYS.PRODUCT_IMAGE_HEIGHT],
    };
  }, [decision]);
}

/**
 * CTA 텍스트 변수를 가져오는 훅
 */
export function useCartCTA() {
  const [decision] = useDecision(FEATURE_FLAGS.CART_CTA_EXPERIMENT);

  return useMemo(() => {
    const variables = decision.variables as Record<string, unknown>;
    
    return {
      addToCartText:
        (variables[VARIABLE_KEYS.ADD_TO_CART_TEXT] as string) ??
        DEFAULT_VALUES[VARIABLE_KEYS.ADD_TO_CART_TEXT],
      checkoutButtonText:
        (variables[VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT] as string) ??
        DEFAULT_VALUES[VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT],
      continueShoppingText:
        (variables[VARIABLE_KEYS.CONTINUE_SHOPPING_TEXT] as string) ??
        DEFAULT_VALUES[VARIABLE_KEYS.CONTINUE_SHOPPING_TEXT],
    };
  }, [decision]);
}

/**
 * 헤더 메시지 변수를 가져오는 훅
 */
export function useHeaderMessage() {
  const [decision] = useDecision(FEATURE_FLAGS.HEADER_MESSAGE_EXPERIMENT);

  return useMemo(() => {
    const variables = decision.variables as Record<string, unknown>;
    
    return {
      message:
        (variables[VARIABLE_KEYS.HEADER_MESSAGE] as string) ??
        DEFAULT_VALUES[VARIABLE_KEYS.HEADER_MESSAGE],
      subtitle:
        (variables[VARIABLE_KEYS.HEADER_SUBTITLE] as string) ??
        DEFAULT_VALUES[VARIABLE_KEYS.HEADER_SUBTITLE],
    };
  }, [decision]);
}

/**
 * 추천 카테고리 변수를 가져오는 훅
 */
export function useFeaturedCategories() {
  const [decision] = useDecision(FEATURE_FLAGS.FEATURED_CATEGORIES_EXPERIMENT);

  return useMemo(() => {
    const variables = decision.variables as Record<string, unknown>;
    
    return {
      categories:
        (variables[VARIABLE_KEYS.FEATURED_CATEGORIES] as string[]) ??
        DEFAULT_VALUES[VARIABLE_KEYS.FEATURED_CATEGORIES],
      showFilter:
        (variables[VARIABLE_KEYS.SHOW_CATEGORY_FILTER] as boolean) ??
        DEFAULT_VALUES[VARIABLE_KEYS.SHOW_CATEGORY_FILTER],
    };
  }, [decision]);
}

/**
 * 무료 배송 임계값 변수를 가져오는 훅
 */
export function useFreeShipping() {
  const [decision] = useDecision(FEATURE_FLAGS.FREE_SHIPPING_THRESHOLD);

  return useMemo(() => {
    const variables = decision.variables as Record<string, unknown>;
    
    return {
      minAmount:
        (variables[VARIABLE_KEYS.FREE_SHIPPING_MIN_AMOUNT] as number) ??
        DEFAULT_VALUES[VARIABLE_KEYS.FREE_SHIPPING_MIN_AMOUNT],
      showInfo:
        (variables[VARIABLE_KEYS.SHOW_SHIPPING_INFO] as boolean) ??
        DEFAULT_VALUES[VARIABLE_KEYS.SHOW_SHIPPING_INFO],
    };
  }, [decision]);
}

/**
 * 제품 카드 스타일 변수를 가져오는 훅
 */
export function useProductCardStyle() {
  const [decision] = useDecision(FEATURE_FLAGS.PRODUCT_CARD_STYLE);

  return useMemo(() => {
    const variables = decision.variables as Record<string, unknown>;
    
    return {
      showDescription:
        (variables[VARIABLE_KEYS.SHOW_PRODUCT_DESCRIPTION] as boolean) ??
        DEFAULT_VALUES[VARIABLE_KEYS.SHOW_PRODUCT_DESCRIPTION],
      borderRadius:
        (variables[VARIABLE_KEYS.PRODUCT_CARD_BORDER_RADIUS] as number) ??
        DEFAULT_VALUES[VARIABLE_KEYS.PRODUCT_CARD_BORDER_RADIUS],
      showAddToCartIcon:
        (variables[VARIABLE_KEYS.SHOW_ADD_TO_CART_ICON] as boolean) ??
        DEFAULT_VALUES[VARIABLE_KEYS.SHOW_ADD_TO_CART_ICON],
    };
  }, [decision]);
}

/**
 * app_rule1 플래그 기반 체크아웃 버튼 텍스트를 가져오는 훅
 */
export function useCheckoutButton() {
  const [decision] = useDecision(FEATURE_FLAGS.APP_RULE1);

  return useMemo(() => {
    const variables = decision.variables as Record<string, unknown>;
    const isEnabled = decision.enabled;
    
    // app_rule1이 on(enabled)이면 변수에서 가져온 값 사용, off면 기본값 사용
    if (isEnabled) {
      return {
        checkoutButtonText:
          (variables[VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT] as string) ??
          DEFAULT_VALUES[VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT],
        isEnabled: true,
      };
    }
    
    // flag가 off이면 기본값 사용
    return {
      checkoutButtonText: DEFAULT_VALUES[VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT],
      isEnabled: false,
    };
  }, [decision]);
}

/**
 * 모든 Optimizely 변수를 한 번에 가져오는 통합 훅
 * 
 * ⚠️ 성능 주의사항:
 * 이 훅은 8개의 개별 Feature Flag를 모두 호출하여 8번의 useDecision을 실행합니다.
 * 
 * 권장사항:
 * - 필요한 변수만 사용하는 경우 개별 훅을 사용하세요 (예: useUITheme(), useCartCTA())
 * - 이 통합 훅은 대부분의 변수가 필요한 경우에만 사용하세요
 * - 컴포넌트 최상위 레벨에서만 호출하고, 렌더링 중간에 호출하지 마세요
 * 
 * 예시:
 * ✅ 좋은 사용: const { uiTheme, cartCTA } = useOptimizelyConfig(); // 여러 변수 필요
 * ✅ 좋은 사용: const { primaryColor } = useUITheme(); // 하나의 그룹만 필요
 * ❌ 나쁜 사용: 모든 변수가 필요하지 않은데 useOptimizelyConfig() 사용
 */
export function useOptimizelyConfig() {
  const uiTheme = useUITheme();
  const discountPromotion = useDiscountPromotion();
  const productGrid = useProductGridLayout();
  const cartCTA = useCartCTA();
  const headerMessage = useHeaderMessage();
  const featuredCategories = useFeaturedCategories();
  const freeShipping = useFreeShipping();
  const productCardStyle = useProductCardStyle();

  return useMemo(
    () => ({
      uiTheme,
      discountPromotion,
      productGrid,
      cartCTA,
      headerMessage,
      featuredCategories,
      freeShipping,
      productCardStyle,
    }),
    [
      uiTheme,
      discountPromotion,
      productGrid,
      cartCTA,
      headerMessage,
      featuredCategories,
      freeShipping,
      productCardStyle,
    ]
  );
}
