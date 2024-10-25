/**
 * Hàm chuyển đổi URL của YouTube thành dạng embed
 * @param {string} url - URL của video YouTube
 * @returns {string} - URL embed của YouTube
 */
export function getEmbedUrl(url) {
    const videoId = extractVideoId(url);
    return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Hàm trích xuất videoId từ URL YouTube
 * @param {string} url - URL của video YouTube
 * @returns {string|null} - videoId nếu tìm thấy, ngược lại trả về null
 */
export function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

/**
 * @param {number|string} amount - Số tiền cần định dạng
 * @returns {string} - Chuỗi số tiền đã định dạng
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'VND');
}
