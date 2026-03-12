// import React from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Pressable,
//   useWindowDimensions,
// } from 'react-native';
// import { s, vs, ms } from 'react-native-size-matters';

// interface SegmentedControlProps {
//   options: string[];
//   selectedIndex: number;
//   onChange: (index: number) => void;
// }

// const SegmentedControl: React.FC<SegmentedControlProps> = ({
//   options,
//   selectedIndex,
//   onChange,
// }) => {
//   const { width: windowWidth } = useWindowDimensions();

//   const CONTAINER_WIDTH = windowWidth * 0.9;
//   const PADDING = s(4);
//   const SEGMENT_WIDTH = (CONTAINER_WIDTH - PADDING * 2) / options.length;
//   const leftPosition = selectedIndex * SEGMENT_WIDTH;

//   return (
//     <View style={[styles.container, { width: CONTAINER_WIDTH }]}>
//       <View
//         style={[
//           styles.activeIndicator,
//           { 
//             width: SEGMENT_WIDTH, 
//             left: PADDING + leftPosition 
//           },
//         ]}
//       />

//       {options.map((option, index) => {
//         const isActive = selectedIndex === index;

//         return (
//           <Pressable
//             key={`segment-${index}`}
//             onPress={() => onChange(index)}
//             style={styles.segment}
//           >
//             <Text
//               style={[
//                 styles.text,
//                 isActive ? styles.textActive : styles.textInactive,
//               ]}
//             >
//               {option}
//             </Text>
//           </Pressable>
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: vs(48), // Reduced from 54 to save vertical space
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: ms(24),
//     padding: s(4),
//     borderWidth: 1,
//     borderColor: '#E8E8E8',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 3,
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   activeIndicator: {
//     position: 'absolute',
//     height: vs(40), // Adjusted for new container height
//     backgroundColor: '#2D4A41',
//     borderRadius: ms(20),
//   },
//   segment: {
//     flex: 1,
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10, 
//   },
//   text: {
//     fontSize: ms(15), // Slightly smaller to match the thinner bar
//     fontWeight: '600',
//     letterSpacing: 0.2,
//   },
//   textActive: {
//     color: '#FFFFFF',
//   },
//   textInactive: {
//     color: '#2D4A41',
//   },
// });

// export default SegmentedControl;

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedIndex,
  onChange,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const CONTAINER_WIDTH = windowWidth - s(32); 
  const PADDING = s(4);
  const SEGMENT_WIDTH = (CONTAINER_WIDTH - PADDING * 2) / options.length;
  const leftPosition = selectedIndex * SEGMENT_WIDTH;

  return (
    <View style={[styles.container, { width: CONTAINER_WIDTH }]}>
      {/* The Sliding Indicator with Figma Teal */}
      <View
        style={[
          styles.activeIndicator,
          { 
            width: SEGMENT_WIDTH, 
            left: PADDING + leftPosition 
          },
        ]}
      />

      {options.map((option, index) => {
        const isActive = selectedIndex === index;

        return (
          <Pressable
            key={`segment-${index}`}
            onPress={() => onChange(index)}
            style={styles.segment}
          >
            <Text
              style={[
                styles.text,
                isActive ? styles.textActive : styles.textInactive,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: vs(54), 
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glass effect
    borderRadius: ms(27),
    padding: s(4),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)', // Glass border
    alignItems: 'center',
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    height: vs(44), 
    backgroundColor: '#21AA8F', // Updated to Figma Teal
    borderRadius: ms(22),
    // Subtle shadow for the active button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segment: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, 
  },
  text: {
    fontSize: ms(15), 
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textActive: {
    color: '#FFFFFF',
  },
  textInactive: {
    color: '#000000',
  },
});

export default SegmentedControl;