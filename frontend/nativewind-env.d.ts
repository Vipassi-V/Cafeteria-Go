/// <reference types="nativewind/types" />

import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
}

// Fix for Lucide Icons + NativeWind
declare module 'lucide-react-native' {
  import { IconProps } from 'lucide-react-native';
  export interface LucideProps extends IconProps {
    className?: string;
  }
}
