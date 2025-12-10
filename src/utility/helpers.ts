import { Colors } from "@/theme/colors";

// Helper function to get status color and background
export const getStatusStyle = (status: string) => {

    switch (status) {
        case 'todo':
            return { color: Colors.AZURE, backgroundColor: Colors.WATER };
        case 'inprogress':
            return { color: Colors.ALLOY_ORANGE, backgroundColor: Colors.OLD_LACE };
        case 'completed':
            return { color: Colors.SALEM, backgroundColor: Colors.HONEYDEW };
        default: // For 'All Task' and any other case
            return { color: Colors.EERIE_BLACK, backgroundColor: Colors.ANTI_FLASH_WHITE };
    }
};

export const getStatusByPriorityStyle = (status: string) => {

    switch (status) {
        case 'low':
            return { color: Colors.AZURE, backgroundColor: Colors.WATER };
        case 'high':
            return { color: Colors.ANTIQUE_RUBY, backgroundColor: Colors.CUSTOM };
        case 'medium':
            return { color: Colors.SALEM, backgroundColor: Colors.HONEYDEW };
        default: // For 'All Task' and any other case
            return { color: Colors.EERIE_BLACK, backgroundColor: Colors.ANTI_FLASH_WHITE };
    }
};

export const formatStatus = (status: string | null | undefined): string => {
    // Return an empty string if the input is invalid
    if (!status) {
        return '';
    }

    const lowerCaseStatus = status.toLowerCase();

    // Handle the special case for "inprogress"
    if (lowerCaseStatus === 'inprogress') {
        return 'In Progress';
    }

    // For all other cases (like 'todo', 'completed'), just capitalize the first letter
    return status.charAt(0).toUpperCase() + status.slice(1);
};