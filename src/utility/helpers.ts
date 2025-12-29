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
export const maskPhoneNumber = (number: string) => {
  if (!number) return '';

  // Sirf digits rakho
  const cleaned = number.replace(/\D/g, '');

  // Agar digits hi kam hon
  if (cleaned.length < 9) {
    return cleaned.replace(/.(?=.{2})/g, 'X');
  }

  // Local number hamesha last 9 digits
  const LOCAL_LENGTH = 9;
  const localNumber = cleaned.slice(-LOCAL_LENGTH);

  // Country code baqi sab
  const countryCode = cleaned.slice(0, cleaned.length - LOCAL_LENGTH);

  const firstDigit = localNumber.charAt(0);

  return `(+${countryCode}) ${firstDigit}XX XXX XXX`;
};

// export const maskPhoneNumber = (number:string) => {
//   if (!number) return '';

//   // sirf digits rakho
//   const cleaned = number.replace(/\D/g, '');

//   // last 9 digits local number
//   const localNumber = cleaned.slice(-9);

//   // country code auto detect
//   const countryCode = cleaned.slice(0, cleaned.length - 9);

//   // first digit visible, baqi mask
//   const firstDigit = localNumber.charAt(0);

//   return `(+${countryCode}) ${firstDigit}XX XXX XXX`;
// };
