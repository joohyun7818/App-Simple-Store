# Optimizely A/B 테스트 빠른 시작 가이드

## 1. 준비 단계 (5분)

### Optimizely SDK Key 설정

```bash
# 환경 변수로 SDK Key 설정
EXPO_PUBLIC_OPTIMIZELY_SDK_KEY=your_sdk_key_here npm start
```

## 2. Optimizely 대시보드에서 첫 번째 실험 생성 (10분)

### 예시: 브랜드 색상 A/B 테스트

1. **Feature Flag 생성**
   - Flag Key: `ui_theme_experiment`
   - Type: Feature Test (A/B Test)

2. **변수 추가**
   - Variable Name: `primary_color`
   - Type: String
   - Default Value: `#007bff`

3. **Variations 설정**
   
   **Control (50% 트래픽)**
   - Name: "파란색 테마 (기본)"
   - Variables:
     - `primary_color`: `#007bff`
   
   **Variant A (50% 트래픽)**
   - Name: "초록색 테마"
   - Variables:
     - `primary_color`: `#10b981`

4. **Metrics 설정**
   - Primary Metric: `add_to_cart` (장바구니 추가)
   - Secondary Metrics: `checkout`, `purchase`

5. **Audience 설정**
   - Everyone (모든 사용자)

6. **실험 시작**
   - "Start Experiment" 버튼 클릭

## 3. 코드에 적용하기 (5분)

### 기존 코드

```tsx
// 기존: 하드코딩된 색상
function MyButton() {
  return (
    <Pressable style={{ backgroundColor: "#007bff" }}>
      <Text>버튼</Text>
    </Pressable>
  );
}
```

### Optimizely 적용 후

```tsx
// 변경: Optimizely 변수 사용
import { useUITheme } from './src/optimizely/useOptimizelyVariables';

function MyButton() {
  const { primaryColor } = useUITheme();
  
  return (
    <Pressable style={{ backgroundColor: primaryColor }}>
      <Text>버튼</Text>
    </Pressable>
  );
}
```

## 4. 이벤트 추적 추가 (5분)

```tsx
import { useTrack } from '@optimizely/react-sdk';

function ProductCard({ product }) {
  const { track } = useTrack();
  
  const handleAddToCart = () => {
    // 장바구니 추가 로직
    addToCart(product);
    
    // Optimizely 이벤트 전송
    track('add_to_cart', {
      productId: product.id,
      price: product.price,
    });
  };
  
  return (
    <Button onPress={handleAddToCart}>
      장바구니 담기
    </Button>
  );
}
```

## 5. 결과 확인 (지속적)

1. Optimizely 대시보드 접속
2. 실험 결과 페이지로 이동
3. 주요 지표 확인:
   - **Conversion Rate**: 각 변형의 전환율
   - **Statistical Significance**: 통계적 유의성 (95% 이상일 때 신뢰)
   - **Improvement**: 개선율 (%)

## 추천 첫 번째 실험 3가지

### 실험 1: 브랜드 색상 (가장 쉬움)

**예상 소요 시간**: 30분 설정 + 1주 실험

**Feature Flag**: `ui_theme_experiment`

**변수**:
- `primary_color`: 브랜드 주요 색상

**Variations**:
- Control: `#007bff` (파란색)
- Variant A: `#10b981` (초록색)
- Variant B: `#f59e0b` (오렌지색)

**측정 지표**:
- 장바구니 추가율
- 구매 완료율

**적용 범위**: 모든 버튼, 링크, 액센트 색상

---

### 실험 2: 할인 배너 (쉬움)

**예상 소요 시간**: 45분 설정 + 1주 실험

**Feature Flag**: `show_discount_banner`

**변수**:
- `discount_enabled`: 배너 표시 여부 (boolean)
- `discount_message`: 배너 메시지 (string)

**Variations**:
- Control: 배너 없음 (`discount_enabled: false`)
- Variant A: 배너 있음 (`discount_enabled: true`, 메시지: "🎉 특별 할인!")

**측정 지표**:
- 장바구니 추가율
- 평균 주문 금액

**적용 범위**: 홈 화면 상단

---

### 실험 3: CTA 버튼 텍스트 (중간)

**예상 소요 시간**: 1시간 설정 + 2주 실험

**Feature Flag**: `cart_cta_experiment`

**변수**:
- `add_to_cart_text`: 장바구니 추가 버튼 텍스트
- `checkout_button_text`: 체크아웃 버튼 텍스트

**Variations**:
- Control: `add_to_cart_text: "＋"`, `checkout_button_text: "주문하기"`
- Variant A: `add_to_cart_text: "담기"`, `checkout_button_text: "결제하기"`
- Variant B: `add_to_cart_text: "장바구니"`, `checkout_button_text: "바로 구매"`

**측정 지표**:
- 버튼 클릭률
- 장바구니 추가율
- 체크아웃 완료율

**적용 범위**: 제품 카드, 장바구니 화면

---

## 자주 묻는 질문

### Q1: 실험 결과를 얼마나 기다려야 하나요?

**A**: 최소 1주일, 권장 2주입니다. 다음 조건을 모두 만족해야 합니다:
- 각 변형에 최소 100명 이상의 사용자
- 95% 이상의 통계적 유의성
- 주중/주말 데이터 모두 포함

### Q2: 여러 실험을 동시에 진행해도 되나요?

**A**: 가능하지만 주의가 필요합니다:
- ✅ 다른 영역 (예: 색상 + 배너): 가능
- ⚠️ 같은 영역 (예: 두 가지 버튼 텍스트): 결과 해석이 어려움
- 권장: 한 번에 2-3개 실험까지

### Q3: 실험이 실패하면 어떻게 하나요?

**A**: 실패도 중요한 학습입니다:
1. 가설을 재검토하세요
2. 사용자 피드백을 수집하세요
3. 더 작은 변경으로 다시 시도하세요

### Q4: 언제 실험을 중단해야 하나요?

**A**: 다음 경우 즉시 중단:
- 명백한 버그나 오류
- 사용자 경험 심각한 저하
- 부정적인 피드백 급증

정상적인 경우:
- 통계적 유의성 달성 (95%+)
- 명확한 승자 확인
- 예정된 기간 종료

### Q5: 모바일 앱에서 변경사항이 즉시 반영되나요?

**A**: 네, Optimizely SDK는 실시간으로 업데이트됩니다:
- 새로운 세션 시작 시 자동 업데이트
- 앱 재시작 불필요
- 네트워크 연결 필요

## 다음 단계

1. ✅ 첫 번째 실험 실행 완료
2. 📊 결과 분석 및 학습
3. 🚀 추가 실험 계획
4. 📈 지속적인 최적화

**전체 가이드**: `OPTIMIZELY_AB_TESTING_GUIDE.md` 참고

**예시 코드**: `src/optimizely/examples.tsx` 참고

**문의사항**: Optimizely 지원팀 또는 개발 팀에 연락
