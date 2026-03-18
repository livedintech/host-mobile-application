import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { AvoidSoftInput } from 'react-native-avoid-softinput'
import KeyboardManager from 'react-native-keyboard-manager'
import { Platform, ScrollViewProps } from 'react-native'

export enum UseCases {
  SCREEN = 'SCREEN',
  SHEET = 'SHEET',
  MODAL = 'MODAL',
}

export enum TriggerEffectEnum {
  FOCUS_EFFECT,
  LAYOUT_EFFECT,
}

export default function useKeyboardManager(): Partial<ScrollViewProps> {
  const handleFocusEffect = useCallback(() => {
    if (Platform.OS === 'android') {
      AvoidSoftInput.setAdjustResize()
    } else {
      KeyboardManager.setEnable(true)
      KeyboardManager.setToolbarPreviousNextButtonEnable(true)
    }

    return () => {
      if (Platform.OS === 'android') {
        AvoidSoftInput.setDefaultAppSoftInputMode()
      } else {
        KeyboardManager.setEnable(false)
      }
    }
  }, [])

  useFocusEffect(handleFocusEffect)

  const scrollViewProps: Partial<ScrollViewProps> = {
    showsVerticalScrollIndicator: false,
    ...(Platform.select({
      android: { overScrollMode: 'always' },
      ios: { contentInsetAdjustmentBehavior: 'always' },
    })),
  }

  return scrollViewProps
}
