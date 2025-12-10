import { Dimensions } from 'react-native'
import { moderateScale } from 'react-native-size-matters'

const { width, height } = Dimensions.get('window')

const screenWidth = width < height ? width : height
const screenHeight = width < height ? height : width

const aspectRatio = height / width

const isTablet = () => aspectRatio < 1.6

const designedOnIphone_13_PM = true

const guidelineBaseWidth = isTablet() ? width - 180 : 428
const guidelineBaseHeight = isTablet() ? height - 180 : 926

const scaleHorizontal = (size: number) => (screenWidth / guidelineBaseWidth) * +size
const scaleVertical = (size: number) => (screenHeight / guidelineBaseHeight) * size

const heightRatio = (size: number) => scaleVertical(size)
const widthRatio = (size: number) => scaleHorizontal(size)

// Sometimes you don't want to scale everything in a linear manner, that's where moderateScale comes in.
// The cool thing about it is that you can control the resize factor (default is 0.5).
// If normal scale will increase your size by +2X, moderateScale will only increase it by +X, for example:
// moderateScale(10) = 15
// moderateScale(10, 0.1) = 11
const factor = 0.5
const generatedFontSize = (size: number) => moderateScale(size, factor)

const keyboardDefaultOptions = {
    extraHeight: 110,
    keyboardOpeningTime: 0,
}

const hitSlop = (x = 10, y = 10) => ({
    hitSlop: { top: y, bottom: y, left: x, right: x },
})

export default {
    designedOnIphone_13_PM,
    verticalScale: heightRatio,
    scale: widthRatio,
    screenWidth,
    screenHeight,
    generatedFontSize,
    isTablet,

    smallMargin: widthRatio(6),
    baseMargin: widthRatio(16),
    doubleBaseMargin: widthRatio(24),
    xDoubleBaseMargin: heightRatio(32),
    horizontalLineHeight: heightRatio(1),
    keyboardDefaultOptions,
    icons: {
        tiny: heightRatio(18),
        small: heightRatio(24),
        normal: heightRatio(32),
        medium: heightRatio(48),
        large: heightRatio(64),
        xl: heightRatio(128),
    },
    images: {
        xSmall: heightRatio(15),
        small: heightRatio(20),
        medium: heightRatio(40),
        large: heightRatio(55),
        xLarge: heightRatio(70),
        avatar: heightRatio(90),
        logo: heightRatio(200),
        radius: heightRatio(100),
        coverWidth: screenWidth,
        coverHeight: screenWidth / 2,
    },
    hitSlop,
}
