/**
 * @param {string} id - ID cần mã hóa
 * @returns {string} - Chuỗi đã mã hóa
 */
export const encodeId = (id) => {
    const randomStr = Math.random().toString(36).substring(2, 8);
    const encodedStr = btoa(`${id}-${randomStr}`);
    return encodedStr;
};

/**
 * @param {string} encodedId 
 * @returns {string|null} 
 */
export const decodeId = (encodedId) => {
    try {
        const decodedStr = atob(encodedId);
        const [id] = decodedStr.split('-');
        return id;
    } catch (error) {
        console.error('Lỗi khi giải mã ID:', error);
        return null;
    }
};
