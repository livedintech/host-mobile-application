import NavigationRoutes from "@/navigation/NavigationRoutes";
import { navigate } from "@/services/navigationService";

export default function useHomeContainer() {
  const onConnect = (platform: string) => {
    console.log(`Connecting to ${platform}`);
    if(platform === 'Connect Airbnb' || 'Connect Gathern'){
      navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING)
    }
    if(platform === 'Connect New Listing'){
      navigate(NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE)
    }
  };
  return { onConnect };
}