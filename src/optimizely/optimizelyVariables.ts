/**
 * Optimizely A/B Testing Variables Configuration
 *
 * 이 파일은 Optimizely를 통해 A/B 테스트를 수행할 수 있는 변수들을 정의합니다.
 * 각 변수는 앱의 사용자 경험과 비즈니스 지표에 영향을 미치는 요소들입니다.
 */

/**
 * Feature Flag Keys
 * Optimizely 프로젝트에서 생성해야 하는 Feature Flag 키들
 */
export const FEATURE_FLAGS = {
  // UI 테마 및 색상 실험
  UI_THEME_EXPERIMENT: "ui_theme_experiment",

  // 할인 프로모션 표시 실험
  SHOW_DISCOUNT_BANNER: "show_discount_banner",

  // 제품 그리드 레이아웃 실험
  PRODUCT_GRID_LAYOUT: "product_grid_layout",

  // 장바구니 CTA 실험
  CART_CTA_EXPERIMENT: "cart_cta_experiment",

  // 헤더 메시지 실험
  HEADER_MESSAGE_EXPERIMENT: "header_message_experiment",

  // 추천 카테고리 실험
  FEATURED_CATEGORIES_EXPERIMENT: "featured_categories_experiment",

  // 무료 배송 임계값 실험
  FREE_SHIPPING_THRESHOLD: "free_shipping_threshold",

  // 제품 카드 스타일 실험
  PRODUCT_CARD_STYLE: "product_card_style",

  // 주문 버튼 규칙
  APP_RULE1: "app_rule1",
} as const;

/**
 * Variable Keys
 * Feature Flag 내에서 사용되는 변수 키들
 */
export const VARIABLE_KEYS = {
  // UI 테마 변수
  PRIMARY_COLOR: "primary_color",
  THEME_NAME: "theme_name",

  // 할인 배너 변수
  DISCOUNT_ENABLED: "discount_enabled",
  DISCOUNT_MESSAGE: "discount_message",
  DISCOUNT_BADGE_TEXT: "discount_badge_text",

  // 제품 그리드 변수
  GRID_COLUMNS: "grid_columns",
  PRODUCT_IMAGE_HEIGHT: "product_image_height",

  // CTA 텍스트 변수
  ADD_TO_CART_TEXT: "add_to_cart_text",
  CHECKOUT_BUTTON_TEXT: "checkout_button_text",
  CONTINUE_SHOPPING_TEXT: "continue_shopping_text",

  // 헤더 메시지 변수
  HEADER_MESSAGE: "header_message",
  HEADER_SUBTITLE: "header_subtitle",

  // 카테고리 변수
  FEATURED_CATEGORIES: "featured_categories",
  SHOW_CATEGORY_FILTER: "show_category_filter",

  // 배송 관련 변수
  FREE_SHIPPING_MIN_AMOUNT: "free_shipping_min_amount",
  SHOW_SHIPPING_INFO: "show_shipping_info",

  // 제품 카드 스타일 변수
  SHOW_PRODUCT_DESCRIPTION: "show_product_description",
  PRODUCT_CARD_BORDER_RADIUS: "product_card_border_radius",
  SHOW_ADD_TO_CART_ICON: "show_add_to_cart_icon",
} as const;

/**
 * Default Values
 * Optimizely에서 변수를 가져오지 못했을 때 사용할 기본값들
 */
export const DEFAULT_VALUES = {
  // UI 테마 기본값
  [VARIABLE_KEYS.PRIMARY_COLOR]: "#007bff",
  [VARIABLE_KEYS.THEME_NAME]: "default",

  // 할인 배너 기본값
  [VARIABLE_KEYS.DISCOUNT_ENABLED]: false,
  [VARIABLE_KEYS.DISCOUNT_MESSAGE]:
    "🎉 특별 할인 이벤트 진행중! 지금 바로 확인하세요!",
  [VARIABLE_KEYS.DISCOUNT_BADGE_TEXT]: "🔥 특가!",

  // 제품 그리드 기본값
  [VARIABLE_KEYS.GRID_COLUMNS]: 2,
  [VARIABLE_KEYS.PRODUCT_IMAGE_HEIGHT]: 120,

  // CTA 텍스트 기본값
  [VARIABLE_KEYS.ADD_TO_CART_TEXT]: "＋",
  [VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT]: "주문하기",
  [VARIABLE_KEYS.CONTINUE_SHOPPING_TEXT]: "쇼핑 계속하기",

  // 헤더 메시지 기본값
  [VARIABLE_KEYS.HEADER_MESSAGE]: "AI Store에 오신 것을 환영합니다!",
  [VARIABLE_KEYS.HEADER_SUBTITLE]: "",

  // 카테고리 기본값
  [VARIABLE_KEYS.FEATURED_CATEGORIES]: ["전자제품", "의류", "도서"],
  [VARIABLE_KEYS.SHOW_CATEGORY_FILTER]: true,

  // 배송 관련 기본값
  [VARIABLE_KEYS.FREE_SHIPPING_MIN_AMOUNT]: 0,
  [VARIABLE_KEYS.SHOW_SHIPPING_INFO]: true,

  // 제품 카드 스타일 기본값
  [VARIABLE_KEYS.SHOW_PRODUCT_DESCRIPTION]: true,
  [VARIABLE_KEYS.PRODUCT_CARD_BORDER_RADIUS]: 16,
  [VARIABLE_KEYS.SHOW_ADD_TO_CART_ICON]: true,
} as const;

/**
 * 타입 및 헬퍼
 * - `VariableKey`: `VARIABLE_KEYS`의 실제 key 문자열 타입입니다
 * - `getDefaultValue`: 코드에서 안전하게 기본값(fallback)을 가져오는 헬퍼입니다
 *
 * 권장 사용법: `decision.variables['checkout_button_text'] ?? getDefaultValue(VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT)`
 */
export type VariableKey = (typeof VARIABLE_KEYS)[keyof typeof VARIABLE_KEYS];

export function getDefaultValue<T = unknown>(key: VariableKey): T {
  return DEFAULT_VALUES[key] as unknown as T;
}

/**
 * Metrics to Track
 * A/B 테스트에서 측정해야 할 주요 지표들
 */
export const METRICS_TO_TRACK = {
  // 전환율 관련
  ADD_TO_CART_RATE: "add_to_cart_rate",
  CHECKOUT_RATE: "checkout_rate",
  PURCHASE_COMPLETION_RATE: "purchase_completion_rate",

  // 참여도 관련
  SESSION_DURATION: "session_duration",
  PRODUCT_VIEW_COUNT: "product_view_count",
  CATEGORY_CLICK_RATE: "category_click_rate",
  SEARCH_USAGE_RATE: "search_usage_rate",

  // 수익 관련
  AVERAGE_ORDER_VALUE: "average_order_value",
  REVENUE_PER_USER: "revenue_per_user",

  // 사용자 경험 관련
  CART_ABANDONMENT_RATE: "cart_abandonment_rate",
  BOUNCE_RATE: "bounce_rate",
} as const;

/**
 * Test Descriptions
 * 각 A/B 테스트의 목적과 가설
 */
export const TEST_DESCRIPTIONS = {
  [FEATURE_FLAGS.UI_THEME_EXPERIMENT]: {
    purpose: "브랜드 색상이 사용자 전환율에 미치는 영향 측정",
    hypothesis:
      "따뜻한 색상(오렌지, 초록)이 차가운 색상(파랑)보다 구매 전환율을 높일 것",
    metrics: [
      METRICS_TO_TRACK.ADD_TO_CART_RATE,
      METRICS_TO_TRACK.CHECKOUT_RATE,
      METRICS_TO_TRACK.PURCHASE_COMPLETION_RATE,
    ],
  },

  [FEATURE_FLAGS.SHOW_DISCOUNT_BANNER]: {
    purpose: "할인 배너 표시가 구매 행동에 미치는 영향 분석",
    hypothesis:
      "할인 배너를 표시하면 즉각적인 구매 욕구를 자극하여 전환율이 증가할 것",
    metrics: [
      METRICS_TO_TRACK.ADD_TO_CART_RATE,
      METRICS_TO_TRACK.AVERAGE_ORDER_VALUE,
      METRICS_TO_TRACK.PURCHASE_COMPLETION_RATE,
    ],
  },

  [FEATURE_FLAGS.PRODUCT_GRID_LAYOUT]: {
    purpose: "제품 그리드 레이아웃이 사용자 경험과 전환율에 미치는 영향 평가",
    hypothesis:
      "2열 그리드가 1열(리스트)이나 3열보다 제품 탐색과 구매 전환에 최적일 것",
    metrics: [
      METRICS_TO_TRACK.PRODUCT_VIEW_COUNT,
      METRICS_TO_TRACK.SESSION_DURATION,
      METRICS_TO_TRACK.ADD_TO_CART_RATE,
    ],
  },

  [FEATURE_FLAGS.CART_CTA_EXPERIMENT]: {
    purpose: "CTA 버튼 텍스트가 클릭률과 전환율에 미치는 영향 측정",
    hypothesis:
      "명확하고 행동 지향적인 CTA 텍스트가 더 높은 전환율을 달성할 것",
    metrics: [
      METRICS_TO_TRACK.ADD_TO_CART_RATE,
      METRICS_TO_TRACK.CHECKOUT_RATE,
    ],
  },

  [FEATURE_FLAGS.HEADER_MESSAGE_EXPERIMENT]: {
    purpose: "헤더 메시지가 첫 인상과 사용자 참여에 미치는 영향 분석",
    hypothesis: "혜택 중심 메시지가 환영 메시지보다 더 높은 참여율을 유도할 것",
    metrics: [
      METRICS_TO_TRACK.SESSION_DURATION,
      METRICS_TO_TRACK.BOUNCE_RATE,
      METRICS_TO_TRACK.PRODUCT_VIEW_COUNT,
    ],
  },

  [FEATURE_FLAGS.FEATURED_CATEGORIES_EXPERIMENT]: {
    purpose: "추천 카테고리 구성이 제품 탐색에 미치는 영향 평가",
    hypothesis:
      "인기 카테고리를 우선 노출하면 제품 탐색과 구매 전환이 증가할 것",
    metrics: [
      METRICS_TO_TRACK.CATEGORY_CLICK_RATE,
      METRICS_TO_TRACK.PRODUCT_VIEW_COUNT,
      METRICS_TO_TRACK.ADD_TO_CART_RATE,
    ],
  },

  [FEATURE_FLAGS.FREE_SHIPPING_THRESHOLD]: {
    purpose: "무료 배송 임계값이 평균 주문 금액에 미치는 영향 측정",
    hypothesis: "무료 배송 임계값을 설정하면 사용자가 더 많은 상품을 구매할 것",
    metrics: [
      METRICS_TO_TRACK.AVERAGE_ORDER_VALUE,
      METRICS_TO_TRACK.CART_ABANDONMENT_RATE,
      METRICS_TO_TRACK.PURCHASE_COMPLETION_RATE,
    ],
  },

  [FEATURE_FLAGS.PRODUCT_CARD_STYLE]: {
    purpose: "제품 카드 디자인이 사용자 경험과 전환율에 미치는 영향 분석",
    hypothesis:
      "간결한 디자인이 복잡한 디자인보다 더 나은 사용자 경험을 제공할 것",
    metrics: [
      METRICS_TO_TRACK.PRODUCT_VIEW_COUNT,
      METRICS_TO_TRACK.ADD_TO_CART_RATE,
      METRICS_TO_TRACK.SESSION_DURATION,
    ],
  },
} as const;
