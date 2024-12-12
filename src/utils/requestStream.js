export const sendMessageRequest = async (messageValue, threadId, END_POINT) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const token = localStorage.getItem('token');
    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const raw = JSON.stringify({
        message: messageValue,
        thread_id: threadId
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL}${END_POINT.CONVERSATION_STREAM}`, requestOptions);
    return response;
};
// export const handleResponseStream = async (response, conversationList) => {
//     const reader = response.body.getReader();
//     const decoder = new TextDecoder("utf-8");

//     const readStream = async () => {
//         let done, value;
//         let fullMessage = '';
//         let buffer = ''; // Buffer để lưu các phần dữ liệu

//         while ({ done, value } = await reader.read(), !done) {
//             let textValue = decoder.decode(value);
//             buffer += textValue.trim();
//             let dataNew = buffer
//             // Xử lý nhiều chuỗi JSON trong buffer
//             console.log("dataNew: ",dataNew)
//             let dataParts = dataNew.split('\r\n\r\n');
//             // console.log("dataParts: ",dataParts)
//             var dataNewDone = dataParts[dataParts.length - 1] // Giữ lại phần chưa hoàn chỉnh trong buffer
//             var dataNewDone1 = dataParts[dataParts.length - 2] // Giữ lại phần chưa hoàn chỉnh trong buffer
//             console.log("dataNewDone",dataNewDone)
//             // console.log("dataNewDone1: ",dataNewDone1)
//             // for (const part of dataParts) {
//             //     try {
//             //         const data = JSON.parse(part);

//             //         if (data.success) {
//             //             fullMessage = data.data.full;
//             //             if (conversationList.value[conversationList.value.length - 1]?.role !== 'model') {
//             //                 conversationList.value.push({
//             //                     role: "model",
//             //                     content: fullMessage
//             //                 });
//             //             } else {
//             //                 conversationList.value[conversationList.value.length - 1].content = fullMessage;
//             //             }
//             //         } else {
//             //             return conversationList.value;
//             //         }

//             //         if (data.data.completed) {
//             //             return conversationList.value;
//             //         }
//             //     } catch (error) {
//             //         console.error("Failed to parse JSON:", error, part); // Log lỗi khi parse JSON
//             //     }
//             // }
//         }

//         return conversationList.value;
//     };

//     return await readStream();
// };
export const handleResponseStream = async (response, conversationList) => {
    if (!response.ok) {
        throw new Error(await response.text());
    }

    // Kiểm tra xem trình duyệt có hỗ trợ ReadableStream không
    if (!response.body) {
        const fullResponse = await response.text();
        try {
            const lines = fullResponse.split('\n');
            for (const line of lines) {
                if (line.trim()) {
                    let newData = {};
                    try {
                        newData = JSON.parse(line);
                    } catch (error) {
                        continue;
                    }
                    
                    const isDuplicate = conversationList[conversationList.length - 1].role === 'model';
                    if (isDuplicate) {
                        conversationList[conversationList.length - 1].content = newData.data.full;
                    }
                }
            }
        } catch (error) {
            console.error('Error processing response:', error);
        }
        return conversationList;
    }

    // Sử dụng getReader() thay vì trực tiếp iterate response.body
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\r\n\r\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.trim()) {
                    let newData = {};
                    try {
                        newData = JSON.parse(line);
                    } catch (error) {
                        continue;
                    }

                    const isDuplicate = conversationList[conversationList.length - 1].role === 'model';
                    if (isDuplicate) {
                        conversationList[conversationList.length - 1].content = newData.data.full;
                    }
                }
            }
        }

        // Xử lý phần còn lại trong buffer
        if (buffer.trim()) {
            try {
                const newData = JSON.parse(buffer);
                const isDuplicate = conversationList[conversationList.length - 1].role === 'model';
                if (isDuplicate) {
                    conversationList[conversationList.length - 1].content = newData.data.full;
                }
            } catch (error) {
                console.error('Error processing final buffer:', error);
            }
        }
    } catch (error) {
        console.error('Error processing stream:', error);
    } finally {
        reader.releaseLock(); // Giải phóng reader
    }

    return conversationList;
};


