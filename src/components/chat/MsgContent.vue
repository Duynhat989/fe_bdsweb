<script setup>
import { onMounted, ref, watch , nextTick} from "vue";
import hljs from "highlight.js";
import MarkdownIt from 'markdown-it';
import copy from 'copy-to-clipboard';
import mathjax3 from 'markdown-it-mathjax3';
import q_a from '@/assets/images/q_a.png';

const md = new MarkdownIt({
    linkify: true,
    highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return `<pre class="hljs-code-container my-3"><div class="hljs-code-header d-flex align-center justify-space-between bg-grey-darken-3 pa-1"><span class="pl-2 text-caption">${language}</span><button class="hljs-copy-button" data-copied="false">Copy</button></div><code class="hljs language-${language}">${hljs.highlight(code, { language: language, ignoreIllegals: true }).value}</code></pre>`
    },
})
md.use(mathjax3)

const contentHtml = ref('');
const contentElm = ref(null);
const msg = ref(null);
const isViewMsg = ref(false);
const isLoading = ref(false);
const text = ref('');

const statusCopy = ref('Copy');

const props = defineProps(["messA", "loading",'text']);

const renderMessage = (message) => {
    contentHtml.value = message ? md.render(message) : '';
    nextTick(() => {
        bindCopyCodeToButtons();
    });
};

const bindCopyCodeToButtons = () => {
    if (!contentElm.value) return;

    const codeContainers = contentElm.value.querySelectorAll('.hljs-code-container');
    codeContainers.forEach((codeContainer) => {
        const copyButton = codeContainer.querySelector('.hljs-copy-button');
        const codeBody = codeContainer.querySelector('code');

        if (copyButton && codeBody) {
            copyButton.onclick = () => {
                copy(codeBody.textContent ?? '');

                copyButton.textContent = 'Copied!';
                copyButton.classList.add('copied');

                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                    copyButton.classList.remove('copied');
                }, 2000);
            };
        }
    });
};
// const stripHTML = (html) => {
//     const tempElement = document.createElement('div');
//     tempElement.innerHTML = html;
//     return tempElement.textContent || tempElement.innerText || '';
// };

// const copyMessageContent = () => {
//     if (contentHtml.value) {
//         const plainText = stripHTML(contentHtml.value);
//         copy(plainText);

//         statusCopy.value = 'Copied!';
//         setTimeout(() => {
//             statusCopy.value = 'Copy';
//         }, 2000);
//     }
// };
const copyMessageContent = () => {
    if (contentHtml.value) {
        copy(contentHtml.value);
        statusCopy.value = 'Copied!';
        setTimeout(() => {
            statusCopy.value = 'Copy';
        }, 2000);
    }
};

onMounted(() => {
    msg.value = props.messA;
    isLoading.value = props.loading;
    text.value = props.text;
    if (msg.value) {
        renderMessage(msg.value.content);
        isViewMsg.value = msg.value.role === "user";
    }
});
watch(
    props.messA,
    (newMsg) => {
        msg.value = newMsg;
        renderMessage(newMsg.content);
    }
);
</script>
<template>
    <div :class="isViewMsg ? 'message message--visible flex' : 'message flex'" v-if="msg">
        <div class="msg-content">
            <div class="message__header">
                <div class="message__icon">
                    <img width="30" height="30" 
                         :src="msg.role === 'user' ? 'https://img.icons8.com/clouds/100/user.png' : q_a" 
                         :alt="msg.role === 'user' ? 'User' : 'Bot'" />
                    <span class="message__role">{{ msg.role === 'user' ? 'You' : text ?? 'AI chat' }}</span>
                </div>
                <button class="message__copy-button" @click="copyMessageContent">
                    {{ statusCopy }} <i class='bx bx-copy'></i>
                </button>
            </div>
            <div ref="contentElm" class="message__body pa-3">
                <div v-if="loading" class="loading-indicator">
                    <i class='bx bx-loader bx-spin' ></i> Loading...
                </div>
                <div v-html="contentHtml"></div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.message {
    display: flex;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 1rem;
    transition: opacity 0.3s ease;
}
.message--visible {
    opacity: 1;
}
.message__icon {
    margin-right: 1rem;
    flex-shrink: 0;
    display: flex;
    gap: 10px;
    align-items: center;
}
.message__icon img {
    border-radius: 50%;
}
.message__content {
    flex-grow: 1;
}
.message__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}
.message__role {
    font-weight: bold;
    color: #333;
}
.message__copy-button {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: 12px;
    transition: color 0.3s ease;
}
.message__copy-button:hover {
    color: #0056b3;
}
.message__loading {
    color: #666;
    font-size: 14px;
}
.message__copy-button {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: 12px;
    transition: color 0.3s ease;
}
.message__copy-button:hover {
    color: #0056b3;
}
.message__copy-button.copied{
    color: #28a745;
    font-weight: bold;
}
</style>
<style >
.message__body.pa-3 {
    background: #fff !important;
    padding: 5px 15px !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    word-break: break-word !important;
}
.hljs-code-container.my-3 {
    background-color: #ececec;
    overflow: auto;
}
.message__body.hljs.language-html {
    padding: 10px !important;
}
pre .hljs-code-container {
    background: #272822!important;
    color: #f8f8f2!important;
    border-radius: 6px!important;
    overflow: hidden!important;
    margin-bottom: 1rem!important;
}
.hljs-code-header {
    background: #444!important;
    color: #ddd!important;
    padding: 0.5rem!important;
    display: flex!important;
    justify-content: space-between!important;
}
.hljs-copy-button {
    background: none!important;
    border: none!important;
    color: #ddd!important;
    cursor: pointer!important;
    font-size: 12px!important;
}
.hljs-copy-button:hover {
    color: #fff!important;
}
.message__body.pa-3 p {
    margin: 0.5rem 0 !important;
    line-height: 1.6 !important;
    color: #333 !important;
}

.message__body.pa-3 ol {
    margin: 1rem 0 !important;
    padding-left: 1.5rem !important;
    list-style-type: decimal !important;
}
.message__body.pa-3 ol li {
    margin: 0.5rem 0 !important;
    color: #555 !important;
}

.message__body.pa-3 ul {
    margin: 1rem 0 !important;
    padding-left: 1.5rem !important;
    list-style-type: disc !important;
}
.message__body.pa-3 ul li {
    margin: 0.5rem 0 !important;
    color: #555 !important;
}
.message__body.pa-3 .pl-2.text-caption {
    color: #fff !important;
}
.message__body.pa-3 span {
    color: #555 !important;
    font-weight: 500 !important;
}

.message__body.pa-3 h1, .message__body.pa-3 h2, .message__body.pa-3 h3 {
    margin: 1rem 0 0.5rem !important;
    font-weight: bold !important;
    color: #222 !important;
}
.message__body.pa-3 h1 {
    font-size: 1.5rem !important;
    border-bottom: 2px solid #ddd !important;
    padding-bottom: 0.3rem !important;
}
.message__body.pa-3 h2 {
    font-size: 1.3rem !important;
    border-bottom: 1px solid #ddd !important;
    padding-bottom: 0.3rem !important;
}
.message__body.pa-3 h3 {
    font-size: 1.1rem !important;
    color: #333 !important;
}

.message__body.pa-3 a {
    color: #007bff !important;
    text-decoration: none !important;
    transition: color 0.3s ease !important;
}
.message__body.pa-3 a:hover {
    color: #0056b3 !important;
    text-decoration: underline !important;
}

.message__body.pa-3 b, .message__body.pa-3 strong {
    font-weight: bold !important;
    color: #000 !important;
}

.message__body.pa-3 em, .message__body.pa-3 i {
    font-style: italic !important;
    color: #666 !important;
}

.message__body.pa-3 code {
    background-color: #f5f5f5 !important;
    padding: 0.2rem 0.4rem !important;
    border-radius: 4px !important;
    font-size: 0.9rem !important;
    color: #d6336c !important;
    font-family: 'Courier New', Courier, monospace !important;
}
.message__body.pa-3 blockquote {
    border-left: 4px solid #ddd !important;
    margin: 1rem 0 !important;
    padding: 0.5rem 1rem !important;
    color: #555 !important;
    background-color: #f9f9f9 !important;
    font-style: italic !important;
}
.message__copy-button.copied,
.hljs-copy-button.copied {
    color: #28a745;
    font-weight: bold;
}
</style>
