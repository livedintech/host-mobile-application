import React from 'react';
import { ActivityIndicator, StyleSheet, ViewStyle, TextStyle, View, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view'; // ✅ Yeh import add kiya hai
import { ButtonProps } from './ButtonProps';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import ButtonView from './ButtonView';
import AppText from '../AppText/AppText';

type ButtonVariant = 'primary' | 'secondary';

const AppButton = ({
    title,
    fontSize = 16,
    textTransform,
    onPress,
    variant = 'primary',
    color,
    backgroundColor,
    borderRadius = 100,
    disabled = false,
    loading = false,
    style,
    textStyle,
    m, mt, mb, ml, mr, mx, my,
    p, pt, pb, pl, pr, px, py,
    type = 'Regular'
}: ButtonProps & {
    style?: StyleProp<ViewStyle>;      // ✅ Isay StyleProp mein wrap kar dein
    textStyle?: StyleProp<TextStyle>;  // ✅ Isay bhi StyleProp mein wrap kar dein
    variant?: ButtonVariant;
}) => {
    const spacingStyles = {
        margin: m !== undefined ? Metrics.verticalScale(m) : undefined,
        marginTop: mt !== undefined ? Metrics.verticalScale(mt) : my !== undefined ? Metrics.verticalScale(my) : undefined,
        marginBottom: mb !== undefined ? Metrics.verticalScale(mb) : my !== undefined ? Metrics.verticalScale(my) : undefined,
        marginLeft: ml !== undefined ? Metrics.scale(ml) : mx !== undefined ? Metrics.scale(mx) : undefined,
        marginRight: mr !== undefined ? Metrics.scale(mr) : mx !== undefined ? Metrics.scale(mx) : undefined,

        padding: p !== undefined ? Metrics.verticalScale(p) : undefined,
        paddingTop: pt !== undefined ? Metrics.verticalScale(pt) : py !== undefined ? Metrics.verticalScale(py) : undefined,
        paddingBottom: pb !== undefined ? Metrics.verticalScale(pb) : py !== undefined ? Metrics.verticalScale(py) : undefined,
        paddingLeft: pl !== undefined ? Metrics.scale(pl) : px !== undefined ? Metrics.scale(px) : undefined,
        paddingRight: pr !== undefined ? Metrics.scale(pr) : px !== undefined ? Metrics.scale(px) : undefined,
    };

    const isPrimary = variant === 'primary';
    const txtColor = color || (isPrimary ? Colors.WHITE : Colors.BLACK);

    // Inner button logic
    const renderButtonInner = (innerBgColor: string) => (
        <ButtonView
            activeOpacity={0.1}
            backgroundColor={innerBgColor}
            style={[
                styles.button,
                { borderRadius },
                isPrimary && { ...spacingStyles }, // Spacing sirf primary me yahan denge
                disabled && styles.disabledButton,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={txtColor} />
            ) : (
                <AppText
                    text={title}
                    fontSize={Metrics.generatedFontSize(fontSize)}
                    textAlign='center'
                    color={disabled ? Colors.DIM_GREY : txtColor}
                    textTransform={textTransform}
                    type={type}
                    style={StyleSheet.flatten([styles.text, textStyle]) as TextStyle}
                />
            )}
        </ButtonView>
    );

    // ✅ "Next" wala button: True Transparent Gradient Border
    if (!isPrimary) {
        return (
            <View style={[spacingStyles, { borderRadius }]}>

                {/* 1. Gradient Border using MaskedView (Yahan magic ho raha hai) */}
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                    <MaskedView
                        style={StyleSheet.absoluteFill}
                        maskElement={
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'transparent', // Andar se khali rahega
                                    borderColor: 'white', // Sirf mask ke liye color chahiye, screen pe nahi dikhega
                                    borderWidth: 1, // Border ki thickness
                                    borderRadius: borderRadius,
                                }}
                            />
                        }
                    >
                        <LinearGradient
                            colors={['rgba(128, 128, 128, 0.66)', 'rgba(255, 255, 255, 0.66)', 'rgba(128, 128, 128, 0.66)']}
                            locations={[0, 0.5356, 1]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </MaskedView>
                </View>

                {/* 2. Main Transparent Button uske upar */}
                {renderButtonInner(Colors.TRANSPARENT)}

            </View>
        );
    }

    // ✅ "Save & Exit" wala button
    return renderButtonInner(backgroundColor || Colors.MEDIUM_JUNGLE_GREEN);
};

export default AppButton;

const styles = StyleSheet.create({
    button: {
        paddingVertical: Metrics.verticalScale(14),
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: Colors.SMOOTH_GREY,
    },
    text: {
        fontWeight: '500',
    }
});