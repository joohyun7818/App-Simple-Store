# Optimizely A/B 테스트 변수 가이드

이 문서는 App-Simple-Store 프로젝트에서 Optimizely를 통해 수행할 수 있는 A/B 테스트 변수들에 대한 가이드입니다.

## 📋 목차

1. [개요](#개요)
2. [변수 목록](#변수-목록)
3. [Optimizely 설정 방법](#optimizely-설정-방법)
4. [코드에서 사용하는 방법](#코드에서-사용하는-방법)
5. [추천 A/B 테스트 시나리오](#추천-ab-테스트-시나리오)
6. [측정 지표](#측정-지표)

## 개요

이 프로젝트는 React Native Expo 앱으로, Optimizely Feature Experimentation SDK를 사용하여 다양한 A/B 테스트를 수행할 수 있습니다. 주요 테스트 영역은 다음과 같습니다:

- **UI 테마 및 색상**: 브랜드 색상 최적화
- **프로모션 배너**: 할인 메시지 효과 측정
- **제품 레이아웃**: 그리드 레이아웃 최적화
- **CTA 버튼**: 전환율 향상을 위한 버튼 텍스트 최적화
- **헤더 메시지**: 첫 인상 최적화
- **카테고리 구성**: 제품 탐색 최적화

## 변수 목록

### 1. UI 테마 실험 (ui_theme_experiment)

**목적**: 브랜드 색상이 사용자 전환율에 미치는 영향 측정

**변수**:
- `primary_color` (string): 앱의 주요 색상
  - 기본값: `"#007bff"`
  - 테스트 변형: `"#10b981"` (초록), `"#f59e0b"` (오렌지), `"#8b5cf6"` (보라)
- `theme_name` (string): 테마 이름
  - 기본값: `"default"`

**영향 범위**: 버튼, 링크, 액센트 색상 등 앱 전체

**추천 측정 지표**:
- 장바구니 추가율
- 체크아웃 완료율
- 구매 전환율

### 2. 할인 배너 실험 (show_discount_banner)

**목적**: 할인 배너 표시가 구매 행동에 미치는 영향 분석

**변수**:
- `discount_enabled` (boolean): 할인 배너 표시 여부
  - 기본값: `false`
- `discount_message` (string): 할인 배너 메시지
  - 기본값: `"🎉 특별 할인 이벤트 진행중! 지금 바로 확인하세요!"`
  - 테스트 변형:
    - `"💝 한정 특가! 놓치지 마세요!"`
    - `"🔥 타임 세일! 지금이 기회!"`
    - `"⭐ 회원 전용 특별 할인"`
- `discount_badge_text` (string): 제품 카드의 할인 뱃지 텍스트
  - 기본값: `"🔥 특가!"`

**영향 범위**: 홈 화면 상단 배너, 제품 카드

**추천 측정 지표**:
- 장바구니 추가율
- 평균 주문 금액
- 구매 완료율

### 3. 제품 그리드 레이아웃 (product_grid_layout)

**목적**: 제품 그리드 레이아웃이 사용자 경험과 전환율에 미치는 영향 평가

**변수**:
- `grid_columns` (number): 그리드 열 수
  - 기본값: `2`
  - 테스트 변형: `1` (리스트형), `3` (컴팩트)
- `product_image_height` (number): 제품 이미지 높이 (픽셀)
  - 기본값: `120`
  - 테스트 변형: `100`, `140`, `160`

**영향 범위**: 홈 화면 제품 목록

**추천 측정 지표**:
- 제품 조회수
- 세션 지속 시간
- 장바구니 추가율

### 4. 장바구니 CTA 실험 (cart_cta_experiment)

**목적**: CTA 버튼 텍스트가 클릭률과 전환율에 미치는 영향 측정

**변수**:
- `add_to_cart_text` (string): 장바구니 추가 버튼 텍스트
  - 기본값: `"＋"`
  - 테스트 변형: `"담기"`, `"장바구니"`, `"구매"`
- `checkout_button_text` (string): 체크아웃 버튼 텍스트
  - 기본값: `"주문하기"`
  - 테스트 변형: `"결제하기"`, `"바로 구매"`, `"지금 구매하기"`
- `continue_shopping_text` (string): 쇼핑 계속하기 버튼 텍스트
  - 기본값: `"쇼핑 계속하기"`

**영향 범위**: 제품 카드, 장바구니 화면

**추천 측정 지표**:
- 장바구니 추가율
- 체크아웃 완료율

### 5. 헤더 메시지 실험 (header_message_experiment)

**목적**: 헤더 메시지가 첫 인상과 사용자 참여에 미치는 영향 분석

**변수**:
- `header_message` (string): 헤더 메인 메시지
  - 기본값: `"AI Store에 오신 것을 환영합니다!"`
  - 테스트 변형:
    - `"최고의 상품을 만나보세요!"`
    - `"특별한 쇼핑 경험, 지금 시작하세요"`
    - `"당신을 위한 특별한 혜택"`
- `header_subtitle` (string): 헤더 서브 메시지
  - 기본값: `""`

**영향 범위**: 앱 헤더

**추천 측정 지표**:
- 세션 지속 시간
- 이탈률
- 제품 조회수

### 6. 추천 카테고리 실험 (featured_categories_experiment)

**목적**: 추천 카테고리 구성이 제품 탐색에 미치는 영향 평가

**변수**:
- `featured_categories` (string[]): 추천 카테고리 목록
  - 기본값: `["전자제품", "의류", "도서"]`
  - 테스트 변형: 다양한 카테고리 조합
- `show_category_filter` (boolean): 카테고리 필터 표시 여부
  - 기본값: `true`

**영향 범위**: 홈 화면 카테고리 섹션

**추천 측정 지표**:
- 카테고리 클릭률
- 제품 조회수
- 장바구니 추가율

### 7. 무료 배송 임계값 실험 (free_shipping_threshold)

**목적**: 무료 배송 임계값이 평균 주문 금액에 미치는 영향 측정

**변수**:
- `free_shipping_min_amount` (number): 무료 배송 최소 금액
  - 기본값: `0` (항상 무료)
  - 테스트 변형: `30000`, `50000`, `100000`
- `show_shipping_info` (boolean): 배송 정보 표시 여부
  - 기본값: `true`

**영향 범위**: 장바구니 화면

**추천 측정 지표**:
- 평균 주문 금액
- 장바구니 이탈률
- 구매 완료율

### 8. 제품 카드 스타일 실험 (product_card_style)

**목적**: 제품 카드 디자인이 사용자 경험과 전환율에 미치는 영향 분석

**변수**:
- `show_product_description` (boolean): 제품 설명 표시 여부
  - 기본값: `true`
- `product_card_border_radius` (number): 제품 카드 모서리 둥글기
  - 기본값: `16`
  - 테스트 변형: `8`, `12`, `20`
- `show_add_to_cart_icon` (boolean): 장바구니 추가 아이콘 표시 여부
  - 기본값: `true`

**영향 범위**: 제품 카드 디자인

**추천 측정 지표**:
- 제품 조회수
- 장바구니 추가율
- 세션 지속 시간

## Optimizely 설정 방법

### 1. Optimizely 프로젝트 생성

1. [Optimizely](https://app.optimizely.com/)에 로그인
2. 새 프로젝트 생성 (Feature Experimentation)
3. SDK Key 복사

### 2. 환경 변수 설정

```bash
# .env 파일 또는 실행 시 환경 변수로 설정
EXPO_PUBLIC_OPTIMIZELY_SDK_KEY=your_sdk_key_here
```

### 3. Optimizely 대시보드에서 Feature Flag 생성

각 Feature Flag를 다음과 같이 생성:

#### 예시: UI Theme Experiment

1. **Flag Key**: `ui_theme_experiment`
2. **Variables**:
   - `primary_color` (string) - 기본값: `#007bff`
   - `theme_name` (string) - 기본값: `default`
3. **Variations**:
   - **Control**: 기본 파란색 테마
     - `primary_color`: `#007bff`
   - **Variant A**: 초록색 테마
     - `primary_color`: `#10b981`
   - **Variant B**: 오렌지색 테마
     - `primary_color`: `#f59e0b`
   - **Variant C**: 보라색 테마
     - `primary_color`: `#8b5cf6`

4. **Audience**: 원하는 타겟 오디언스 설정
5. **Metrics**: 추적할 이벤트 설정

### 4. 이벤트 추적 설정

Optimizely 대시보드에서 다음 이벤트들을 설정:

- `add_to_cart`: 장바구니 추가
- `checkout`: 체크아웃 시작
- `purchase`: 구매 완료
- `product_view`: 제품 조회
- `category_click`: 카테고리 클릭

## 코드에서 사용하는 방법

### 방법 1: 개별 훅 사용 (권장)

```tsx
import { useUITheme, useDiscountPromotion } from './src/optimizely/useOptimizelyVariables';

function MyComponent() {
  // UI 테마 변수 가져오기
  const { primaryColor, themeName } = useUITheme();
  
  // 할인 프로모션 변수 가져오기
  const { enabled, message, badgeText } = useDiscountPromotion();
  
  return (
    <View>
      {enabled && (
        <View style={{ backgroundColor: primaryColor }}>
          <Text>{message}</Text>
        </View>
      )}
    </View>
  );
}
```

### 방법 2: 통합 훅 사용

```tsx
import { useOptimizelyConfig } from './src/optimizely/useOptimizelyVariables';

function MyComponent() {
  const config = useOptimizelyConfig();
  
  return (
    <View>
      <Button color={config.uiTheme.primaryColor}>
        {config.cartCTA.addToCartText}
      </Button>
    </View>
  );
}
```

### 방법 3: 직접 useDecision 사용

```tsx
import { useDecision } from '@optimizely/react-sdk';
import { FEATURE_FLAGS, VARIABLE_KEYS, DEFAULT_VALUES } from './src/optimizely/optimizelyVariables';

function MyComponent() {
  const [decision] = useDecision(FEATURE_FLAGS.UI_THEME_EXPERIMENT);
  
  const primaryColor = 
    (decision.variables[VARIABLE_KEYS.PRIMARY_COLOR] as string) || 
    DEFAULT_VALUES[VARIABLE_KEYS.PRIMARY_COLOR];
  
  return <Button color={primaryColor}>Click me</Button>;
}
```

### 이벤트 추적 예시

```tsx
import { useTrack } from '@optimizely/react-sdk';

function ProductCard({ product }) {
  const { track } = useTrack();
  
  const handleAddToCart = () => {
    // 장바구니에 추가
    addToCart(product);
    
    // Optimizely 이벤트 추적
    track('add_to_cart', {
      productId: product.id,
      price: product.price,
      category: product.category,
    });
  };
  
  return (
    <Button onPress={handleAddToCart}>
      장바구니 담기
    </Button>
  );
}
```

## 추천 A/B 테스트 시나리오

### 시나리오 1: 색상 최적화 (초급)

**목표**: 가장 높은 전환율을 달성하는 브랜드 색상 찾기

**설정**:
- Feature Flag: `ui_theme_experiment`
- Variations: 파란색(Control), 초록색, 오렌지색, 보라색
- Traffic: 각 25%
- Duration: 2주

**측정 지표**:
- Primary: 구매 완료율
- Secondary: 장바구니 추가율, 평균 주문 금액

**예상 결과**: 따뜻한 색상(오렌지)이 10-15% 더 높은 전환율 달성

### 시나리오 2: 할인 배너 효과 (초급)

**목표**: 할인 배너가 실제로 구매를 촉진하는지 검증

**설정**:
- Feature Flag: `show_discount_banner`
- Variations: 
  - Control: 배너 없음
  - Variant A: 배너 있음 (메시지 A)
  - Variant B: 배너 있음 (메시지 B)
- Traffic: Control 50%, Variants 각 25%
- Duration: 1주

**측정 지표**:
- Primary: 장바구니 추가율
- Secondary: 평균 주문 금액, 구매 완료율

**예상 결과**: 배너가 즉각적인 전환율을 5-10% 향상

### 시나리오 3: CTA 최적화 (중급)

**목표**: 가장 효과적인 CTA 버튼 텍스트 찾기

**설정**:
- Feature Flag: `cart_cta_experiment`
- Variations:
  - Control: "＋" / "주문하기"
  - Variant A: "담기" / "결제하기"
  - Variant B: "장바구니" / "바로 구매"
  - Variant C: "구매" / "지금 구매하기"
- Traffic: 각 25%
- Duration: 2주

**측정 지표**:
- Primary: 장바구니 추가율, 체크아웃 완료율
- Secondary: 클릭률, 전환 시간

**예상 결과**: 명확한 행동 지향 텍스트가 15-20% 더 높은 전환율

### 시나리오 4: 그리드 레이아웃 최적화 (중급)

**목표**: 최적의 제품 표시 레이아웃 찾기

**설정**:
- Feature Flag: `product_grid_layout`
- Variations:
  - Control: 2열 그리드
  - Variant A: 1열 리스트
  - Variant B: 3열 그리드
- Traffic: Control 50%, Variants 각 25%
- Duration: 2주

**측정 지표**:
- Primary: 제품 조회수, 세션 지속 시간
- Secondary: 장바구니 추가율

**예상 결과**: 2열 그리드가 가장 균형 잡힌 사용자 경험 제공

### 시나리오 5: 다변수 테스트 (고급)

**목표**: 색상, 메시지, CTA를 동시에 최적화

**설정**:
- Multiple Feature Flags 조합
- Variations: 2³ = 8가지 조합
- Traffic: 각 12.5%
- Duration: 3-4주

**측정 지표**:
- Primary: 전체 전환율
- Secondary: 모든 주요 지표

**주의사항**: 
- 충분한 트래픽 필요 (최소 일 1000+ 방문자)
- 통계적 유의성 확보까지 시간 소요

## 측정 지표

### 전환율 관련

- **장바구니 추가율**: (장바구니 추가 수 / 제품 조회 수) × 100
- **체크아웃 완료율**: (체크아웃 완료 수 / 장바구니 조회 수) × 100
- **구매 완료율**: (구매 완료 수 / 체크아웃 시작 수) × 100

### 참여도 관련

- **세션 지속 시간**: 평균 앱 사용 시간
- **제품 조회수**: 제품 상세 페이지 방문 횟수
- **카테고리 클릭률**: (카테고리 클릭 수 / 세션 수) × 100
- **검색 사용률**: (검색 수 / 세션 수) × 100

### 수익 관련

- **평균 주문 금액** (AOV): 총 매출 / 주문 수
- **사용자당 매출** (RPU): 총 매출 / 활성 사용자 수

### 사용자 경험 관련

- **장바구니 이탈률**: (장바구니 이탈 수 / 장바구니 생성 수) × 100
- **이탈률**: (1페이지만 본 세션 수 / 전체 세션 수) × 100

## 모범 사례

### 1. 테스트 설계

- **한 번에 하나씩**: 여러 변경사항을 동시에 테스트하지 말 것
- **충분한 샘플**: 통계적 유의성을 위해 충분한 트래픽 확보
- **적절한 기간**: 최소 1-2주, 계절성 고려
- **명확한 가설**: 테스트 전에 예상 결과 정의

### 2. 트래픽 분배

- **초기 테스트**: Control 70%, Variant 30%로 시작
- **검증된 테스트**: 50/50 분배
- **다변수 테스트**: 균등 분배

### 3. 의사 결정

- **통계적 유의성**: 95% 이상 신뢰도
- **실질적 개선**: 최소 5% 이상 개선
- **부작용 확인**: 다른 지표에 악영향 없는지 확인

### 4. 반복 및 학습

- **결과 문서화**: 모든 테스트 결과 기록
- **인사이트 공유**: 팀과 학습 내용 공유
- **지속적 개선**: 승리한 변형을 기반으로 추가 최적화

## 문제 해결

### SDK가 초기화되지 않음

```typescript
// optimizelyClient.ts에서 SDK Key 확인
console.log('SDK Key:', process.env.EXPO_PUBLIC_OPTIMIZELY_SDK_KEY);
```

### 변수 값이 업데이트되지 않음

1. Optimizely 대시보드에서 Feature Flag 활성화 확인
2. 변수 이름이 정확한지 확인
3. 앱 재시작

### 이벤트가 추적되지 않음

1. Optimizely 대시보드에서 이벤트 정의 확인
2. 네트워크 탭에서 Optimizely API 호출 확인
3. `track()` 함수 호출 확인

## 추가 리소스

- [Optimizely React SDK 문서](https://docs.developers.optimizely.com/feature-experimentation/docs/react-sdk)
- [Optimizely 베스트 프랙티스](https://docs.developers.optimizely.com/feature-experimentation/docs/best-practices)
- [A/B 테스팅 가이드](https://www.optimizely.com/optimization-glossary/ab-testing/)
