/**
 * @param {number|string} amount - Số tiền cần định dạng
 * @returns {string} - Chuỗi số tiền đã định dạng
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'VND');
}
