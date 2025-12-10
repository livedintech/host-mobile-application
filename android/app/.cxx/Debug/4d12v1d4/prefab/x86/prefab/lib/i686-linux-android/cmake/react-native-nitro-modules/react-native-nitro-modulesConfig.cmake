if(NOT TARGET react-native-nitro-modules::NitroModules)
add_library(react-native-nitro-modules::NitroModules SHARED IMPORTED)
set_target_properties(react-native-nitro-modules::NitroModules PROPERTIES
    IMPORTED_LOCATION "/Users/livedin/Desktop/Project/HostMobileApp/node_modules/react-native-nitro-modules/android/build/intermediates/cxx/Debug/h34502fi/obj/x86/libNitroModules.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/livedin/Desktop/Project/HostMobileApp/node_modules/react-native-nitro-modules/android/build/headers/nitromodules"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

