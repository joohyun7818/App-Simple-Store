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

2. **플래그 상태 확인**: `useCheckoutButton()` 훅이 `app_rule1` 플래그의 상태를 확인합니다.

3. **조건부 텍스트 적용**:
   - **ON (enabled = true)**: Optimizely 변수 `checkout_button_text`의 값을 사용
   - **OFF (enabled = false)**: 기본값 "주문하기" 사용

4. **실시간 반영**: 플래그 상태가 변경되면 React의 useMemo를 통해 자동으로 UI가 업데이트됩니다.

## Optimizely 설정 방법

### 1. Feature Flag 생성

Optimizely 대시보드에서:

1. **Flags** 탭으로 이동
2. **Create New Flag** 클릭
3. Flag 키를 `app_rule1`로 설정
4. **Create Flag** 클릭

### 2. 변수 설정

Feature Flag에 변수 추가:

1. 생성한 `app_rule1` 플래그 선택
2. **Variables** 섹션으로 이동
3. **Add Variable** 클릭
4. 변수 설정:
   - **Key**: `checkout_button_text`
   - **Type**: String
   - **Default Value**: `"주문하기"`

### 3. 변형(Variation) 설정

다양한 버튼 텍스트를 테스트하기 위해 변형을 추가:

**Control (기본값)**:
- `checkout_button_text`: "주문하기"

**Variation A**:
- `checkout_button_text`: "결제하기"

**Variation B**:
- `checkout_button_text`: "바로 구매"

**Variation C**:
- `checkout_button_text`: "지금 구매하기"

### 4. 실험 설정

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
2. 변수 값을 원하는 텍스트로 설정 (예: "결제하기")
3. 앱을 재시작하거나 장바구니 화면을 새로고침
4. 버튼 텍스트가 변경된 것을 확인

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
  const { checkoutButtonText } = useCheckoutButton();
  
  const handleCheckout = async () => {
    // 이벤트 추적
    track("checkout_button_clicked", {
      buttonText: checkoutButtonText,
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

3. **캐싱**: Optimizely SDK는 datafile을 캐싱하므로, 플래그 변경 후 즉시 반영되지 않을 수 있습니다. 앱을 재시작하면 최신 설정을 가져옵니다.

4. **기본값**: 플래그가 OFF이거나 네트워크 오류가 발생한 경우 항상 기본값 "주문하기"가 표시됩니다.

## 확장 가능성

이 구현은 다음과 같이 확장할 수 있습니다:

1. **다른 버튼에 적용**: "쇼핑 계속하기", "로그인" 등 다른 CTA 버튼에도 동일한 패턴 적용

2. **버튼 스타일 변경**: 텍스트뿐만 아니라 색상, 크기 등도 Optimizely 변수로 제어

3. **조건부 표시**: 버튼을 완전히 숨기거나 다른 버튼으로 교체

4. **다중 플래그**: 여러 플래그를 조합하여 복잡한 실험 수행

## 문제 해결

### 버튼 텍스트가 변경되지 않는 경우:

1. **SDK 키 확인**: 환경 변수가 올바르게 설정되었는지 확인
2. **플래그 상태 확인**: Optimizely 대시보드에서 플래그가 활성화되었는지 확인
3. **네트워크 확인**: 앱이 인터넷에 연결되어 있는지 확인
4. **로그 확인**: 콘솔에서 Optimizely 관련 오류 메시지 확인
5. **앱 재시작**: 앱을 완전히 종료하고 다시 시작

### 디버깅 팁:

```typescript
export function useCheckoutButton() {
  const [decision] = useDecision(FEATURE_FLAGS.APP_RULE1);

  return useMemo(() => {
    // 디버깅용 로그
    console.log('app_rule1 decision:', {
      enabled: decision.enabled,
      variables: decision.variables,
      variationKey: decision.variationKey,
    });
    
    // ... 기존 코드 ...
  }, [decision]);
}
```

## 참고 자료

- [Optimizely React SDK 문서](https://docs.developers.optimizely.com/feature-experimentation/docs/react-sdk)
- [Optimizely Feature Flags 가이드](https://docs.developers.optimizely.com/feature-experimentation/docs/create-feature-flags)
- [프로젝트 Optimizely 가이드](./OPTIMIZELY_AB_TESTING_GUIDE.md)
- [프로젝트 Quick Start 가이드](./OPTIMIZELY_QUICK_START.md)
