import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle,
    View,
    StyleProp,
    Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from '@react-native-community/blur';
import { ButtonProps } from './ButtonProps';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import ButtonView from './ButtonView';
import AppText from '../AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

type ButtonVariant = 'primary' | 'secondary';

const AppButton = ({
    title,
    leftIcon,
    rightIcon,
    iconSize = 18,
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
    type = 'Regular',
}: ButtonProps & {
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    variant?: ButtonVariant;
    leftIcon?: string;
    rightIcon?: string;
    iconSize?: number;
}) => {

    // ─── Spacing ────────────────────────────────────────────────────────────────
    const spacingStyles = {
        margin:        m  !== undefined ? Metrics.verticalScale(m)  : undefined,
        marginTop:     mt !== undefined ? Metrics.verticalScale(mt) : my !== undefined ? Metrics.verticalScale(my) : undefined,
        marginBottom:  mb !== undefined ? Metrics.verticalScale(mb) : my !== undefined ? Metrics.verticalScale(my) : undefined,
        marginLeft:    ml !== undefined ? Metrics.scale(ml)         : mx !== undefined ? Metrics.scale(mx)         : undefined,
        marginRight:   mr !== undefined ? Metrics.scale(mr)         : mx !== undefined ? Metrics.scale(mx)         : undefined,
        padding:       p  !== undefined ? Metrics.verticalScale(p)  : undefined,
        paddingTop:    pt !== undefined ? Metrics.verticalScale(pt) : py !== undefined ? Metrics.verticalScale(py) : undefined,
        paddingBottom: pb !== undefined ? Metrics.verticalScale(pb) : py !== undefined ? Metrics.verticalScale(py) : undefined,
        paddingLeft:   pl !== undefined ? Metrics.scale(pl)         : px !== undefined ? Metrics.scale(px)         : undefined,
        paddingRight:  pr !== undefined ? Metrics.scale(pr)         : px !== undefined ? Metrics.scale(px)         : undefined,
    };

    const isPrimary = variant === 'primary';

    const txtColor = color || (
        disabled  ? '#0000005E' :
        isPrimary ? Colors.WHITE :
                    '#222222'
    );

    // ─── Gradient border ─────────────────────────────────────────────────────────
    const renderGradientBorder = (isLight = false) => (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <MaskedView
                style={StyleSheet.absoluteFill}
                maskElement={
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            borderColor: 'white',
                            borderWidth: 1,
                            borderRadius,
                        }}
                    />
                }
            >
                {isLight ? (
                    <LinearGradient
                        colors={[
                            'rgba(255, 255, 255, 0.90)',
                            'rgba(180, 180, 180, 0.66)',
                            'rgba(140, 140, 140, 0.50)',
                        ]}
                        locations={[0, 0.5356, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                ) : (
                    <LinearGradient
                        colors={[
                            'rgba(128, 128, 128, 0.66)',
                            'rgba(255, 255, 255, 0.66)',
                            'rgba(128, 128, 128, 0.66)',
                        ]}
                        locations={[0, 0.5356, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                )}
            </MaskedView>
        </View>
    );

    // ─── Button inner content ────────────────────────────────────────────────────
    const renderButtonInner = (innerBgColor: string) => (
        <ButtonView
            activeOpacity={0.1}
            backgroundColor={innerBgColor}
            style={[
                styles.button,
                { borderRadius, flexDirection: 'row' },
                isPrimary && !disabled && { ...spacingStyles },
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={Colors.WHITE} />
            ) : (
                <>
                    {leftIcon && (
                        <View style={{ marginRight: 8 }}>
                            <Svgicons path={leftIcon} size={iconSize} color={txtColor} />
                        </View>
                    )}

                    <AppText
                        text={title}
                        fontSize={Metrics.generatedFontSize(fontSize)}
                        textAlign="center"
                        color={txtColor}
                        textTransform={textTransform}
                        type={type}
                        style={StyleSheet.flatten([styles.text, textStyle]) as TextStyle}
                    />

                    {rightIcon && (
                        <View style={{ marginLeft: 8 }}>
                            <Svgicons path={rightIcon} size={iconSize} color={txtColor} />
                        </View>
                    )}
                </>
            )}
        </ButtonView>
    );

    // ─── PRIMARY DISABLED ────────────────────────────────────────────────────────
    if (isPrimary && disabled) {
        return (
            <View style={[spacingStyles, { borderRadius }]}>
                {renderGradientBorder(false)}
                {renderButtonInner(Colors.TRANSPARENT)}
            </View>
        );
    }

    // ─── SECONDARY — Frosted Glass with FIXED borderRadius ──────────────────────
    //
    //  FIX: BlurView does NOT respect borderRadius on Android.
    //  Solution:
    //   - Outer View has borderRadius + overflow: 'hidden'  ← clips everything
    //   - BlurView fills absoluteFill inside clipped container
    //   - No borderRadius needed on BlurView itself
    //
    if (!isPrimary) {
        return (
            <View style={[spacingStyles]}>

                {/* ── OUTERMOST: gradient border wrapper ── */}
                <View style={{ borderRadius, overflow: 'hidden' }}>
                    {/* Heavy frosted base */}
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.45)' }]} />
                    {/* Strong top-to-bottom diffusion */}
                    <LinearGradient
                        colors={['rgba(255,255,255,0.80)', 'rgba(255,255,255,0.30)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                    {/* Diagonal shimmer */}
                    <LinearGradient
                        colors={['rgba(255,255,255,0.50)', 'rgba(255,255,255,0.00)', 'rgba(255,255,255,0.25)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                    {/* Bottom depth */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.00)', 'rgba(0,0,0,0.10)']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 0, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                    {renderGradientBorder()}
                    {renderButtonInner(Colors.TRANSPARENT)}
                </View>
            </View>
        );
    }

    // ─── PRIMARY (enabled) ───────────────────────────────────────────────────────
    return renderButtonInner(backgroundColor || Colors.MEDIUM_JUNGLE_GREEN);
};

export default AppButton;

const styles = StyleSheet.create({
    button: {
        paddingVertical: Metrics.verticalScale(14),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Metrics.scale(15),
    },
    text: { fontWeight: '500' },
});
