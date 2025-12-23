import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ButtonProps } from './ButtonProps';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import ButtonView from './ButtonView';
import AppText from '../AppText/AppText';

const AppButton = ({
    title,
    fontSize = 14,
    textTransform,
    onPress,
    color = Colors.BRUNSWICK_GREEN,
    borderColor = Colors.ARGENT,
    backgroundColor = Colors.WHITE,
    borderRadius = 100,
    disabled = false,
    loading = false,
    style,
    m, mt, mb, ml, mr, mx, my,
    p, pt, pb, pl, pr, px, py,
    type ='Regular'
}: ButtonProps) => {
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

    return (
        <ButtonView
            style={[
                styles.button,
                { backgroundColor, borderRadius, borderColor, borderWidth: 2, ...spacingStyles },
                disabled && styles.disabledButton,
                disabled && { borderColor: Colors.BLACK },
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={color} />
            ) : (
                <AppText text={title} fontSize={Metrics.generatedFontSize(fontSize)} textAlign='center' color={disabled ? Colors.BLACK : color} textTransform={textTransform} type={type}/>
            )}
        </ButtonView>
    );
};

export default AppButton;

const styles = StyleSheet.create({
    button: {
        paddingVertical: Metrics.verticalScale(10),
    },
    disabledButton: {
        backgroundColor: Colors.BLACK,
    },
});
