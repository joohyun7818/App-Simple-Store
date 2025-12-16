# Optimizely A/B Testing Integration

이 디렉토리는 Optimizely Feature Experimentation SDK를 사용한 A/B 테스트 구현을 포함합니다.

## 📁 파일 구조

```
src/optimizely/
├── optimizelyClient.ts       # Optimizely SDK 클라이언트 초기화
├── optimizelyUser.ts          # 사용자 정보를 Optimizely 형식으로 변환
├── optimizelyVariables.ts     # A/B 테스트 변수 정의 (Feature Flags, 기본값, 변형)
├── useOptimizelyVariables.ts  # React Hook으로 변수 접근
└── examples.tsx               # 사용 예시 코드
```

## 🚀 빠른 시작

### 1. 환경 변수 설정

```bash
EXPO_PUBLIC_OPTIMIZELY_SDK_KEY=your_sdk_key npm start
```

### 2. Hook 사용

```tsx
import { useUITheme, useCartCTA } from './src/optimizely/useOptimizelyVariables';

function MyComponent() {
  const { primaryColor } = useUITheme();
  const { addToCartText } = useCartCTA();
  
  return (
    <Button color={primaryColor}>
      {addToCartText}
    </Button>
  );
}
```

### 3. 이벤트 추적

```tsx
import { useTrack } from '@optimizely/react-sdk';

function ProductCard({ product }) {
  const { track } = useTrack();
  
  const handleAddToCart = () => {
    track('add_to_cart', {
      productId: product.id,
      price: product.price,
    });
  };
  
  return <Button onPress={handleAddToCart}>담기</Button>;
}
```

## 📚 상세 문서

프로젝트 루트의 문서를 참고하세요:

- **전체 가이드**: `/OPTIMIZELY_AB_TESTING_GUIDE.md`
- **빠른 시작**: `/OPTIMIZELY_QUICK_START.md`
- **구현 요약**: `/IMPLEMENTATION_SUMMARY.md`

## 🎯 구현된 A/B 테스트 변수

### 1. UI 테마 (`ui_theme_experiment`)
- `primary_color`: 브랜드 주요 색상
- `theme_name`: 테마 이름

### 2. 할인 프로모션 (`show_discount_banner`)
- `discount_enabled`: 할인 배너 표시 여부
- `discount_message`: 할인 배너 메시지
- `discount_badge_text`: 할인 뱃지 텍스트

### 3. 제품 그리드 (`product_grid_layout`)
- `grid_columns`: 그리드 열 수 (1, 2, 3)
- `product_image_height`: 제품 이미지 높이

### 4. 장바구니 CTA (`cart_cta_experiment`)
- `add_to_cart_text`: 장바구니 추가 버튼 텍스트
- `checkout_button_text`: 체크아웃 버튼 텍스트
- `continue_shopping_text`: 쇼핑 계속하기 버튼 텍스트

### 5. 헤더 메시지 (`header_message_experiment`)
- `header_message`: 헤더 메인 메시지
- `header_subtitle`: 헤더 서브 메시지

### 6. 추천 카테고리 (`featured_categories_experiment`)
- `featured_categories`: 추천 카테고리 목록
- `show_category_filter`: 카테고리 필터 표시 여부

### 7. 무료 배송 (`free_shipping_threshold`)
- `free_shipping_min_amount`: 무료 배송 최소 금액
- `show_shipping_info`: 배송 정보 표시 여부

### 8. 제품 카드 스타일 (`product_card_style`)
- `show_product_description`: 제품 설명 표시 여부
- `product_card_border_radius`: 제품 카드 모서리 둥글기
- `show_add_to_cart_icon`: 장바구니 아이콘 표시 여부

## 🔧 커스텀 Hook

- `useUITheme()` - UI 테마 변수
- `useDiscountPromotion()` - 할인 프로모션 변수
- `useProductGridLayout()` - 그리드 레이아웃 변수
- `useCartCTA()` - CTA 텍스트 변수
- `useHeaderMessage()` - 헤더 메시지 변수
- `useFeaturedCategories()` - 카테고리 변수
- `useFreeShipping()` - 배송 관련 변수
- `useProductCardStyle()` - 제품 카드 스타일 변수
- `useOptimizelyConfig()` - 모든 변수 통합

## 📊 측정 지표

주요 추적 이벤트:
- `add_to_cart` - 장바구니 추가
- `checkout` - 체크아웃 시작
- `purchase` - 구매 완료
- `product_view` - 제품 조회
- `category_click` - 카테고리 클릭
- `search` - 검색 수행

## 💡 모범 사례

1. **항상 기본값 제공**: Optimizely 서버 연결 실패 시 대비
2. **타입 안전성**: TypeScript를 활용한 타입 체크
3. **명확한 변수명**: 이해하기 쉬운 변수 이름 사용
4. **문서화**: 각 실험의 목적과 가설 명시
5. **점진적 롤아웃**: 처음엔 작은 트래픽으로 시작

## 🐛 문제 해결

### SDK가 초기화되지 않음
- `EXPO_PUBLIC_OPTIMIZELY_SDK_KEY` 환경 변수 확인
- Optimizely 대시보드에서 SDK Key 재확인

### 변수 값이 기본값으로만 나옴
- Feature Flag가 Optimizely에서 활성화되었는지 확인
- 변수 이름이 정확한지 확인
- 네트워크 연결 확인

### TypeScript 에러
- `@optimizely/react-sdk` 패키지 설치 확인
- tsconfig.json 설정 확인

## 📖 추가 리소스

- [Optimizely React SDK 문서](https://docs.developers.optimizely.com/feature-experimentation/docs/react-sdk)
- [Feature Flags 베스트 프랙티스](https://docs.developers.optimizely.com/feature-experimentation/docs/best-practices)
- [A/B 테스팅 가이드](https://www.optimizely.com/optimization-glossary/ab-testing/)
