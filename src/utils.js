export const isJsonString = (str) => {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null;
  } catch (e) {
    return false;
  }
};

export const convertPrice = (price) => {
  try {
    const result = price?.toLocaleString().replayAll(',', '.')
    return `${result} VND`
  } catch (error) {
    return null
  }
}