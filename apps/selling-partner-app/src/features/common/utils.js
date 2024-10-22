/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} string - The string to capitalize.
 * @returns {string} The input string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (string) => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

/**
 * Formats a number as currency.
 *
 * @param {number} amount - The amount to format.
 * @param {string} currency - The currency to format in.
 * @returns {string} The formatted currency string.
 */
export const formatAsCurrency = (amount, currency = 'INR') => {
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
  return formattedAmount.replace(/(\D)(\d)/, '$1 $2');
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

/**
 * Combines a first name and a last name into a full name.
 *
 * @param {string} firstName - The first name.
 * @param {string} lastName - The last name.
 * @returns {string} The full name, or just the first name if the last name is not provided.
 */
export const getFullName = (firstName, lastName) => {
  if (!firstName) return '';
  if (!lastName) return firstName;
  return `${firstName} ${lastName}`;
};
