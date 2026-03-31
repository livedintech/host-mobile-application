import { useRoute } from '@react-navigation/native';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function usePropertyTourContainer() {
  const route = useRoute<any>();
  
  // Pichli screen se aane wale params get kar rahe hain
  // existingPhotos yahan ek object hona chahiye jaise: { Listing: [...], Room: [...] }
  const { isEdit, existingPhotos = {} } = route.params || {};

  // Dynamically object ki keys se tourData bana rahe hain
  const tourData = Object.keys(existingPhotos).map((categoryName, index) => {
    const photosArray = existingPhotos[categoryName] || [];
    
    // Agar photos hain toh pehli photo ko cover bana lo, nahi toh fallback
    const coverImage = photosArray.length > 0 
      ? photosArray[0]?.url 
      : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=500&auto=format&fit=crop';
      
    return {
      id: index.toString(),
      title: categoryName, // Yeh 'Listing', 'Room' ya jo bhi key hogi wo show karega
      count: photosArray.length,
      image: coverImage,
    };
  });

  const handleGoBack = () => {
    goBack();
  };

  const handleExport = () => {
    console.log('Export trigger');
  };

  const handleCardPress = (selectedCategory: string) => {
    // Jab user kisi card par click kare, toh sirf us category ka array aage bhejein
    navigate(NavigationRoutes.APP_STACK.OTHER_VIDEOS, {
      isEdit: isEdit,
      existingPhotos: existingPhotos[selectedCategory] || [],
      category: selectedCategory,     
    });
  };

  return {
    tourData,
    handleGoBack,
    handleExport,
    handleCardPress,
  };
}