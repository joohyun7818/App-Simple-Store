# app_rule1 플래그 구현 가이드

## 개요

이 문서는 Optimizely의 `app_rule1` 플래그를 사용하여 장바구니 화면의 주문 버튼 텍스트를 동적으로 변경하는 기능에 대한 가이드입니다.

## 구현 내용

### 1. Feature Flag 추가 (`src/optimizely/optimizelyVariables.ts`)

```typescript
export const FEATURE_FLAGS = {
  // ... 기존 플래그들 ...

  // 주문 버튼 규칙
  APP_RULE1: "app_rule1",
} as const;
```

### 2. 커스텀 훅 생성 (`src/optimizely/useOptimizelyVariables.ts`)

```typescript
/**
 * app_rule1 플래그 기반 체크아웃 버튼 텍스트를 가져오는 훅
 *
 * Optimizely의 app_rule1 플래그의 decide 결과에서 변수값(`checkout_button_text` 또는 `CHECKOUT_BUTTONS`)을 읽고,
 * 플래그가 ON이면 해당 값(또는 기본값)을 사용합니다. (변형 값을 코드에 하드코딩하지 않음)
 */
export function useCheckoutButton() {
  const [decision] = useDecision(FEATURE_FLAGS.APP_RULE1);
  const variables = decision.variables as Record<string, unknown>;

  const fromVariables =
    (variables["CHECKOUT_BUTTONS"] as string | undefined) ??
    (variables[VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT] as string | undefined);

  return {
    checkoutButtonText: decision.enabled
      ? fromVariables ?? DEFAULT_VALUES[VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT]
      : DEFAULT_VALUES[VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT],
    isEnabled: decision.enabled,
    variationKey: decision.variationKey ?? null,
  };
}
```

### 3. CartScreen 업데이트 (`src/screens/CartScreen.tsx`)

```typescript
import { useCheckoutButton } from "../optimizely/useOptimizelyVariables";

export function CartScreen({ ... }) {
  // ... 기존 코드 ...
  const { checkoutButtonText } = useCheckoutButton();

  // ... 렌더링 코드 ...
  <Text style={styles.primaryText}>{checkoutButtonText}</Text>
}
```

## 작동 방식

1. **Optimizely SDK 초기화**: 앱 시작 시 Optimizely SDK가 초기화되고 설정된 SDK 키로 연결됩니다.

2. **플래그 상태 확인**: `useCheckoutButton()` 훅이 `app_rule1` 플래그의 decide 결과를 확인합니다.

3. **Variation / Variables**:

   - Optimizely에서 반환하는 `variationKey`는 플랫폼에서 자동 할당됩니다 (예: "control", "variant_a" 등).
   - 권장 방식: 각 variation에 `checkout_button_text` 같은 변수를 설정하고, 앱에서는 `decision.variables['checkout_button_text']`로 값을 읽어 사용하세요.
   - 예: control variation의 `checkout_button_text` = "주문하기", variant_a의 `checkout_button_text` = "결제하기" 등 — 모든 값을 Optimizely 대시보드에서 관리합니다.

4. **조건부 텍스트 적용**:

   - **ON (enabled = true)**: Optimizely의 variationKey에 해당하는 CHECKOUT_BUTTONS 값 사용
   - **OFF (enabled = false)**: 기본값 "주문하기" (control) 사용

5. **실시간 반영**: 플래그 상태가 변경되면 React의 useMemo를 통해 자동으로 UI가 업데이트됩니다.

## Optimizely 설정 방법

### 1. Feature Flag 생성

Optimizely 대시보드에서:

1. **Flags** 탭으로 이동
2. **Create New Flag** 클릭
3. Flag 키를 `app_rule1`로 설정
4. **Create Flag** 클릭

### 2. 변형(Variation) 설정

**app_rule1** 플래그에서 변형을 설정합니다. Optimizely는 각 variation에 자동으로 키를 할당합니다:

**Control (기본값)**:

- Variation Key: `control` (자동 할당)
- 버튼 텍스트: "주문하기"

**Variation A**:

- Variation Key: `variant_a` (자동 할당)
- 버튼 텍스트: "결제하기"

**Variation B**:

- Variation Key: `variant_b` (자동 할당)
- 버튼 텍스트: "바로 구매"

**Variation C**:

- Variation Key: `variant_c` (자동 할당)
- 버튼 텍스트: "지금 구매하기"

### 3. 실험 설정

1. **Experiments** 탭으로 이동
2. **Create New Experiment** 클릭
3. 실험 이름 입력 (예: "체크아웃 버튼 텍스트 최적화")
4. Feature Flag로 `app_rule1` 선택
5. 변형 간 트래픽 분배 설정 (예: 25% 씩)
6. **Start Experiment** 클릭

## 테스트 방법

### 로컬 테스트

1. **Optimizely SDK 키 설정**:

   ```bash
   EXPO_PUBLIC_OPTIMIZELY_SDK_KEY=<YOUR_SDK_KEY> npm start
   ```

2. **앱 실행**:

   - iOS: `i` 키 입력
   - Android: `a` 키 입력

3. **테스트 시나리오**:
   - 로그인 후 장바구니에 상품 추가
   - 장바구니 화면으로 이동
   - 주문 버튼의 텍스트 확인

### Optimizely 대시보드에서 플래그 제어

#### ON 상태 테스트:

1. Optimizely 대시보드에서 `app_rule1` 플래그를 **ON**으로 설정
2. 특정 variation을 선택 (예: variant_a)
3. 앱을 재시작하거나 장바구니 화면을 새로고침
4. 버튼 텍스트가 해당 variation의 값으로 변경된 것을 확인
   - variant_a → "결제하기"
   - variant_b → "바로 구매"
   - variant_c → "지금 구매하기"

#### OFF 상태 테스트:

1. Optimizely 대시보드에서 `app_rule1` 플래그를 **OFF**로 설정
2. 앱을 재시작하거나 장바구니 화면을 새로고침
3. 버튼 텍스트가 기본값 "주문하기"로 표시되는지 확인

### 사용자 세그먼트 테스트

특정 사용자 그룹에만 플래그를 적용하려면:

1. Optimizely 대시보드에서 **Audiences** 생성
2. 조건 설정 (예: 국가가 "KR"인 사용자)
3. `app_rule1` 플래그의 **Targeting Rules**에 Audience 추가
4. 해당 조건을 만족하는 사용자로 로그인하여 테스트

## 측정 지표

이 A/B 테스트에서 추적해야 할 주요 지표:

1. **체크아웃 완료율**: 장바구니에서 주문 완료까지의 전환율
2. **버튼 클릭률**: 주문 버튼 클릭 횟수
3. **평균 주문 금액**: 각 변형별 평균 주문 금액
4. **장바구니 이탈률**: 장바구니에서 나가는 비율

### 이벤트 추적 예시

```typescript
import { useTrack } from "@optimizely/react-sdk";

function CartScreen() {
  const { track } = useTrack();
  const { checkoutButtonText, variationKey } = useCheckoutButton();

  const handleCheckout = async () => {
    // 이벤트 추적
    track("checkout_button_clicked", {
      buttonText: checkoutButtonText,
      variationKey: variationKey,
      cartTotal: total,
    });

    await checkout();
    onGoOrders();
  };

  // ...
}
```

## 주의사항

1. **SDK 키 필수**: `EXPO_PUBLIC_OPTIMIZELY_SDK_KEY` 환경 변수가 설정되어 있어야 합니다.

2. **로그인 필요**: Optimizely 사용자 ID는 로그인한 사용자 정보를 기반으로 생성됩니다.

3. **Variation Key / Variables**: 변형 키에 하드코딩된 매핑을 사용하지 말고, 각 variation에 `checkout_button_text` 같은 변수를 설정하세요. 앱은 `decision.variables['checkout_button_text']`로 값을 읽고, 값이 없으면 코드의 기본값을 fallback으로 사용합니다.

4. **캐싱**: Optimizely SDK는 datafile을 캐싱하므로, 플래그 변경 후 즉시 반영되지 않을 수 있습니다. 앱을 재시작하면 최신 설정을 가져옵니다.

5. **기본값**: 플래그가 OFF이거나 네트워크 오류가 발생한 경우, 또는 variationKey가 매칭되지 않는 경우 항상 기본값 "주문하기" (control)가 표시됩니다.

## CHECKOUT_BUTTONS 변형 커스터마이징

변형별 텍스트는 **Optimizely 대시보드에서 각 variation의 `checkout_button_text` 변수**로 설정하세요. 예시(대시보드에서 설정하는 값):

```json
// variation: control
{"checkout_button_text": "주문하기"}

// variation: variant_a
{"checkout_button_text": "결제하기"}
```

로컬에서 예시가 필요하면 `tests/fixtures/ab-variations.ts`에 JSON 형태로 보관하고 테스트/스토리북에서 로드하세요. (프로덕션 번들에 포함하지 마세요.)

## 확장 가능성

이 구현은 다음과 같이 확장할 수 있습니다:

1. **다른 버튼에 적용**: "쇼핑 계속하기", "로그인" 등 다른 CTA 버튼에도 동일한 패턴 적용

2. **버튼 스타일 변경**: 텍스트뿐만 아니라 색상, 크기 등도 variation별로 제어

3. **조건부 표시**: 버튼을 완전히 숨기거나 다른 버튼으로 교체

4. **다중 플래그**: 여러 플래그를 조합하여 복잡한 실험 수행

## 문제 해결

### 버튼 텍스트가 변경되지 않는 경우:

1. **SDK 키 확인**: 환경 변수가 올바르게 설정되었는지 확인
2. **플래그 상태 확인**: Optimizely 대시보드에서 플래그가 활성화되었는지 확인
3. **Variation Key 확인**: Optimizely가 반환하는 variationKey가 "control", "variant_a", "variant_b", "variant_c" 중 하나인지 확인
4. **네트워크 확인**: 앱이 인터넷에 연결되어 있는지 확인
5. **로그 확인**: 콘솔에서 Optimizely 관련 오류 메시지 확인
6. **앱 재시작**: 앱을 완전히 종료하고 다시 시작

### 디버깅 팁:

```typescript
export function useCheckoutButton() {
  const [decision] = useDecision(FEATURE_FLAGS.APP_RULE1);

  return useMemo(() => {
    // 디버깅용 로그 - variables를 직접 출력하고 fallback 여부 확인
    console.log("app_rule1 decision:", {
      enabled: decision.enabled,
      variationKey: decision.variationKey,
      variables: decision.variables,
      checkoutText:
        decision.variables["checkout_button_text"] ??
        DEFAULT_VALUES[VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT],
    });

    // ... 기존 코드 ...
  }, [decision]);
}
```

## 참고 자료

- [Optimizely React SDK 문서](https://docs.developers.optimizely.com/feature-experimentation/docs/react-sdk)
- [Optimizely Feature Flags 가이드](https://docs.developers.optimizely.com/feature-experimentation/docs/create-feature-flags)
- [Optimizely Variations 가이드](https://docs.developers.optimizely.com/feature-experimentation/docs/create-variations)
- [프로젝트 Optimizely 가이드](./OPTIMIZELY_AB_TESTING_GUIDE.md)
- [프로젝트 Quick Start 가이드](./OPTIMIZELY_QUICK_START.md)
