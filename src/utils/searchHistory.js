// utils/searchHistory.js
const MAX_HISTORY = 10; // số lượng từ khóa lưu lại

// LƯU LỊCH SỬ TÌM KIẾM
export const saveSearchQuery = (query) => {
  if (!query?.trim()) return;

  let history = JSON.parse(localStorage.getItem('search_history') || '[]');
  
  // Xóa nếu đã tồn tại (đưa lên đầu)
  history = history.filter(item => item !== query.trim());
  
  // Thêm vào đầu danh sách
  history.unshift(query.trim());
  
  // Chỉ giữ lại tối đa MAX_HISTORY từ khóa
  history = history.slice(0, MAX_HISTORY);
  
  localStorage.setItem('search_history', JSON.stringify(history));
};

// LẤY TOÀN BỘ LỊCH SỬ
export const getSearchHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('search_history') || '[]');
  } catch {
    return [];
  }
};

// XÓA TOÀN BỘ LỊCH SỬ (nếu cần nút "Xóa lịch sử")
export const clearSearchHistory = () => {
  localStorage.removeItem('search_history');
};