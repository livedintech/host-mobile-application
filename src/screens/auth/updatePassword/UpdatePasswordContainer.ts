import { useForm } from "react-hook-form";
import { useRoute } from "@react-navigation/native"; // Import useRoute
import NavigationRoutes from "@/navigation/NavigationRoutes";
import { updateFirstTimePasswordApi } from "@/services/authApi";
import { navigate } from "@/services/navigationService";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

const UpdatePasswordContainer = () => {
  const route = useRoute();
  const userId = route.params?.userId; // Get the ID passed from login

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: updateFirstTimePasswordApi,
    onSuccess: (data) => {
      Toast.show({ type: 'success', text1: data?.message || "Password updated!" });
      navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
    },
    onError: (error: any) => {
      // Check for specific API error structure
      const errorMsg = error?.data?.message || error?.message || 'Update failed';
      Toast.show({ type: 'error', text1: errorMsg });
    },
  });

  const onSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      Toast.show({ type: 'error', text1: "Passwords do not match" });
      return;
    }

    if (!userId) {
      Toast.show({ type: 'error', text1: "User reference missing. Please login again." });
      return;
    }

    // Mapping form data to your exact Payload Interface
    const payload = {
      user_id: userId,
      new_password: data.password,
      new_password_confirmation: data.confirmPassword,
    };

    updatePassword(payload);
  };

  return {
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: isPending,
    watch,
  };
};

export default UpdatePasswordContainer;