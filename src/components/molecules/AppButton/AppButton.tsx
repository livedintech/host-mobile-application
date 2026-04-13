import React from 'react';
import { ActivityIndicator, StyleSheet, ViewStyle, TextStyle, View, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
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
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
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

    // ✅ Disabled hone par text color semi-transparent black, warna normal color
    const txtColor = color || (disabled ? '#0000005E' : isPrimary ? Colors.WHITE : Colors.BLACK);

    // Gradient border — reusable for both secondary and disabled primary
    const renderGradientBorder = () => (
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
    );

    // Inner button logic
    const renderButtonInner = (innerBgColor: string) => (
        <ButtonView
            activeOpacity={0.1}
            backgroundColor={innerBgColor}
            style={[
                styles.button,
                { borderRadius },
                isPrimary && !disabled && { ...spacingStyles },
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
                    color={txtColor}
                    textTransform={textTransform}
                    type={type}
                    style={StyleSheet.flatten([styles.text, textStyle]) as TextStyle}
                />
            )}
        </ButtonView>
    );

    // ✅ Primary disabled: gradient border + transparent background + dim text
    if (isPrimary && disabled) {
        return (
            <View style={[spacingStyles, { borderRadius }]}>
                {renderGradientBorder()}
                {renderButtonInner(Colors.TRANSPARENT)}
            </View>
        );
    }

    // ✅ Secondary (e.g. "Next") button: gradient border + transparent bg
    if (!isPrimary) {
        return (
            <View style={[spacingStyles]}>
                <View style={{ borderRadius, overflow: 'hidden' }}>

                    {/* Gradient Border */}
                    {renderGradientBorder()}

                    {/* Inner Button with spacing to show border */}
                    <View style={{ margin: 1 }}>
                        {renderButtonInner(backgroundColor || Colors.TRANSPARENT)}
                    </View>

                </View>
            </View>
        );
    }

    // ✅ Primary enabled: solid background
    return renderButtonInner(backgroundColor || Colors.MEDIUM_JUNGLE_GREEN);
};

export default AppButton;

const styles = StyleSheet.create({
    button: {
        paddingVertical: Metrics.verticalScale(14),
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontWeight: '500',
    },
});