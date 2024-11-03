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
export const handleResponseStream = async (response, conversationList) => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    const readStream = async () => {
        let done, value;
        while ({ done, value } = await reader.read(), !done) {
            console.log(value,'value');
            let textValue = decoder.decode(value);
            console.log(textValue,'textValue');
            
            console.log(textValue.trim().split('\r\n\r\n'))
            textValue = textValue.trim().split('\r\n\r\n').pop();
            console.log(textValue)
            if (textValue) {
                try {
                    const data = JSON.parse(textValue);
                    if (data.success) {
                        if (conversationList.value[conversationList.value.length - 1]?.role !== 'model') {
                            conversationList.value.push({
                                role: "model",
                                content: data.data.full
                            });
                        } else {
                            conversationList.value[conversationList.value.length - 1].content = data.data.full;
                        }
                    } else {
                        return conversationList.value;
                    }

                    if (data.data.completed) {
                        return conversationList.value;
                    }
                } catch (error) {
                    console.error("Failed to parse JSON:", error, textValue); // Log the parsing error
                }
            }
        }
        return conversationList.value;
    };

    return await readStream();
};
