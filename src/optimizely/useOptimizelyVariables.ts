import { useDecision } from "@optimizely/react-sdk";
import {
  FEATURE_FLAGS,
  VARIABLE_KEYS,
  DEFAULT_VALUES,
  getDefaultValue,
} from "./optimizelyVariables";

/**
 * app_rule1 플래그 기반 체크아웃 버튼 텍스트를 가져오는 훅
 *
 * Optimizely의 app_rule1 플래그의 decide 결과에 따라 CHECKOUT_BUTTONS 변형에서
 * 해당하는 버튼 텍스트를 반환합니다.
 *
 * - 플래그가 ON이고 variationKey가 있으면: CHECKOUT_BUTTONS[variationKey] 사용
 * - 플래그가 OFF이거나 매칭되는 값이 없으면: 기본값 "주문하기" 사용
 */
export function useCheckoutButton() {
  const [decision] = useDecision(FEATURE_FLAGS.APP_RULE1);

  const variables = decision.variables as Record<string, unknown>;

  // Optimizely 변수 키는 프로젝트 설정에 따라 다를 수 있어서 두 키를 모두 지원합니다.
  // - 사용자가 설정한 변수명: "CHECKOUT_BUTTONS"
  // - 기존 코드에서 사용하던 변수명: VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT ("checkout_button_text")
  const fromVariables =
    (variables["CHECKOUT_BUTTONS"] as string | undefined) ??
    (variables[VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT] as string | undefined);

  return {
    checkoutButtonText: decision.enabled
      ? fromVariables ??
        getDefaultValue<string>(VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT)
      : getDefaultValue<string>(VARIABLE_KEYS.CHECKOUT_BUTTON_TEXT),
    isEnabled: decision.enabled,
    variationKey: decision.variationKey ?? null,
  };
}
