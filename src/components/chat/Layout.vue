<script setup>
import { onMounted, ref, defineProps, watchEffect, watch } from "vue";
import MsgContentView from "@/components/chat/MsgContent.vue";
import CryptoJS from 'crypto-js';
import { sendMessageUtils } from "../../interact/gemini";


function generateToken() {
    var timestamp = Math.floor(Date.now() / 1000).toString();
    var random_number = Math.floor(Math.random() * 1000000).toString(); // Chuỗi 6 chữ số ngẫu nhiên
    var data = timestamp + random_number;
    return sha256(data);
}
function sha256(data) {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}
const txtMessgae = ref('')
const listMessages = ref([])
const isLoadingMessage = ref(false)
let newToken = generateToken()
const newChat = async () => {
    newToken = generateToken()
    listMessages.value = []
}
const getTextFromClipboard = (item) => {
    return new Promise((resolve, reject) => {
        item.getAsString((text) => {
            resolve(text);
        });
    });
};
const handlePaste = async (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file' && item.type.includes('image')) {
            const file = item.getAsFile();
            const base64 = await convertToBase64(file);
            fileImageData.value.push({
                base64: base64.split(',')[1]
            })
            // Lưu base64 vào biến hoặc làm bất kỳ thứ gì bạn muốn ở đây
        } else if (item.kind === 'string' && item.type === 'text/plain') {
            // Nếu là dữ liệu văn bản, thêm vào text area
            const text = await getTextFromClipboard(item);
            txtMessgae.value += text;
        }
    }
};

const addImage = async () => {
    try { document.querySelector('#onewise-image-id').click(); } catch (error) { }
}
const sendEnter = (event) => {
    if (!event.shiftKey) { // Kiểm tra xem phím Shift có được nhấn không
        senMessage(); // Chỉ thực thi khi không có phím Shift được nhấn
    }
}
const autoScroll = () => {
    var container = document.querySelector('.message-content-ows');
    // Cuộn xuống dưới cùng khi nội dung được hiển thị
    container.scrollTop = container.scrollHeight;
}
const senMessage = async () => {
    if (txtMessgae.value == '') {
        return
    }
    listMessages.value.push({
        role: 'user',
        pasts: [
            { text: txtMessgae.value.trim() }
        ]
    })
    const tempMessage = txtMessgae.value.trim()
    const tempMessageImage = fileImageData.value
    txtMessgae.value = ''
    fileImageData.value = []
    isLoadingMessage.value = true
    setTimeout(() => { autoScroll() }, 200)
    ///---------------------------

    try {
        var result = await sendMessageUtils({
            action: "chat",
            id_object: newToken,
            msg: tempMessage,
            images: tempMessageImage
        })
        isLoadingMessage.value = false
        if (result.id_object == newToken) {
            if (result.status) {
                listMessages.value.push({
                    role: 'model',
                    pasts: [
                        { text: result.msg_res ? result.msg_res : 'Inappropriate content' }
                    ]
                })
                setTimeout(() => { autoScroll() }, 500)
            } else {
                console.log('errr')
            }
        }
    } catch (error) {
        // alert(JSON.stringify(error))
        alert('error')
        location.reload()
    }
}
const sizeWindow = ref(true)
const fileImageData = ref([])
const convertToBase64 = (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 800; // Thiết lập chiều rộng mới cho ảnh
                    canvas.height = img.height * (canvas.width / img.width);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const base64String = canvas.toDataURL('image/jpeg');
                    resolve(base64String);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        } catch (error) {
            reject(error);
        }
    });

}
const handleFileAvataChange = async (event) => {
    const file = event.target.files
    // Lấy thông tin cơ bản của file
    var base64 = await convertToBase64(file[0])
    fileImageData.value.push({
        base64: base64.split(',')[1]
    })
    //có được base 64
};
onMounted(() => {
    console.log(listMessages.value)
})
//icon image
const isShowMenuPro = ref(false)
</script>
<template>
    <div class="Onewise-popChat">
        <div :class="`Onewise-chat x2window`">
            <div class="Onewise-form">
                <div class="Onewise-message-chat">
                    <div class="Onewise-messages">
                        <div class="message-content-ows" v-if="listMessages.length > 0">
                            <MsgContentView v-for="(item, index) of listMessages" :msg="item" />
                            <MsgContentView v-if="isLoadingMessage" 
                               :msg="{
                                    role: 'model',
                                    content: ''
                                }" />
                        </div>
                        <div class="message-content-ows center" v-else>
                            <div class="welcome">
                                <h1>OneWise AI</h1>
                            </div>
                            <div class="wel">
                                <img width="50" height="50" :src="`https://i.ibb.co/MgXy079/icon.png`" alt="icon.png">
                                <h2 style="color: white;">How can I help you today?</h2>
                            </div>
                            <div class="welcome-plugin flex">
                                <div class="plugin">
                                    <div class="plugin-content">
                                        <h3>Email</h3>
                                        <p style="margin: 0;">Create emails according to available forms
                                        </p>
                                    </div>
                                </div>
                                <div class="plugin">
                                    <div class="plugin-content">
                                        <h3>Code</h3>
                                        <p style="margin: 0;">Create emails according to available forms
                                            forms forms</p>
                                    </div>
                                </div>
                                <div class="plugin">
                                    <div class="plugin-content">
                                        <h3>Plan</h3>
                                        <p style="margin: 0;">Create emails according to available forms
                                        </p>
                                    </div>
                                </div>
                                <div class="plugin">
                                    <div class="plugin-content">
                                        <h3>Creation</h3>
                                        <p style="margin: 0;">Create emails according to available forms
                                        </p>
                                    </div>
                                </div>
                                <div class="plugin">
                                    <div class="plugin-content">
                                        <h3>Education</h3>
                                        <p style="margin: 0;">Create emails according to available forms
                                        </p>
                                    </div>
                                </div>
                                <div class="plugin">
                                    <div class="plugin-content">
                                        <h3>Branding</h3>
                                        <p style="margin: 0;">Create emails according to available forms
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="show-img" v-if="fileImageData.length > 0">
                            <div class="image-size" v-for="(item, index) of fileImageData">
                                <img width="80" :src="`data:image/png;base64,${item.base64}`" alt="image">
                                <label @click="fileImageData.splice(index, 1)">x</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="onewise-message-input flex">
                    <div class="onewise-btn onewise-btn-chat-new">
                        <input id="onewise-image-id" type="file" hidden @change="handleFileAvataChange($event)">
                        <button @click="addImage()"><img width="30" height="30"
                                src="https://img.icons8.com/material-rounded/24/ffffff/image.png"
                                alt="image" /></button>
                    </div>
                    <div class="onewise-btn-chat-input">
                        <textarea @paste="handlePaste($event)" v-model="txtMessgae" placeholder="Message..." rows="2"
                            @keyup.enter="sendEnter($event)" @click="isShowMenuPro = false"></textarea>

                        <div class="onewise-btn onewise-btn-chat-submit">
                            <div @click="senMessage()" class="cioni">
                                <i class='bx bx-up-arrow-alt'></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.Onewise-popChat .Onewise-chat h1 {
    color: white;
}

.Onewise-popChat .Onewise-chat h2 {
    color: white;
}

.Onewise-popChat .Onewise-chat h3 {
    color: white;
}

.Onewise-popChat .Onewise-chat h4 {
    color: white;
}

.Onewise-popChat .Onewise-chat h5 {
    color: white;
}

.Onewise-popChat .Onewise-chat h6 {
    color: white;
}
</style>
<style scoped>
.sub-menu-pro {
    position: fixed;
    top: -10%;
    right: 0;
    width: 0;
    height: 0;
    background: #454545;
    z-index: 999;
    padding: 10px;
    border-radius: 10px;
    transition: all 0.8s;
    visibility: hidden;
    opacity: 0;
}

.show-pro {
    top: 45px;
    right: 10px;
    visibility: visible;
    opacity: 1;
    width: 370px;
    min-height: 300px;
}


.show-img {
    position: absolute;
    bottom: 100px;
    right: 0;
    z-index: 99;
    display: flex;
    max-width: 400px;
    overflow-x: auto;
}

.image-size {
    position: relative;
}

.image-size label {
    position: absolute;
    top: 5px;
    right: 5px;
    background: white;
    color: red;
    display: block;
    width: 20px;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
}

.show-img img {
    margin-right: 2px;
}

.welcome-plugin {
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 30px;
    width: 100%;
    max-width: 500px;
    margin: auto;
}

.center {
    text-align: center;
}


.Onewise-popChat {
    color: white;
}

.topleft {
    top: 10px;
    left: 10px;
}

.topright {
    top: 10px;
    right: 10px;
}

.bottomleft {
    bottom: 10px;
    left: 10px;
}

.bottomright {
    bottom: 10px;
    right: 10px;
}

.Onewise-icon .icon img {
    border-radius: 50%;
    cursor: pointer;
}

.Onewise-chat {
    width: 100%;
    height: calc(100vh - 100px);
    color: white;
    border-radius: 15px;
    transition: all 1s !important;
    position: relative;
}

.hidden {
    width: 0;
    height: 0;
    /* background: none; */
}

.Onewise-header {
    background: none;
}

.flex {
    display: flex;
}

h6 {
    margin: 0;
    padding: 0;
}

.Onewise-message-chat {
    padding: 10px;
}

.hidden .Onewise-form {
    display: none;
}

.onewise-btn {
    display: flex;
    align-items: center;
    width: 50px;
}

.onewise-btn button {
    border: none;
    border-radius: 3px;
    background: none;
    cursor: pointer;
    color: white;
    text-decoration: underline;
    text-transform: uppercase;
    height: 45px;
    width: 44px;
}

.onewise-btn-chat-submit div {
    cursor: pointer;
    margin-left: 4px;
    position: absolute;
    bottom: 20px;
    right: 10px;
    background: #000000;
    text-align: center;
    width: 35px;
    height: 35px;
    line-height: 35px;
    border-radius: 6px;
    color: rgb(255, 255, 255);
    border: 1px solid rgba(128, 128, 128, 0.568);
}

.onewise-btn-chat-input {
    width: calc(100% - 50px);
    position: relative;
}

.onewise-btn-chat-input textarea {
    height: auto;
    border-radius: 10px;
    border: 1px solid rgba(128, 128, 128, 0.26);
    margin-left: 5px;
    width: 100%;
    background: none;
    color: white;
    padding: 10px;
    /* max-height: 40px; */

}

.onewise-btn-chat-input textarea:focus {
    outline: 1px solid rgba(128, 128, 128, 0.301);
}

.message-content-ows {
    height: calc(100vh - 230px);
    overflow-y: auto;
    padding: 10px;
}

.message-content-ows .wel {
    padding: 10px 0;
}

.pro-style {
    padding: 5px;
    border: 1px solid white;
    border-radius: 3px;
    cursor: pointer;
}

.onewise-message-input {
    justify-content: center;
    position: absolute;
    bottom: 10px;
    width: 100%;
    padding: 10px;
    padding-right: 20px;
}

.talk {
    padding: 10px 0px;
}

.talk img {
    margin-right: 5px;
    width: 20px;
    height: 18px;
}

.message-content-ows::-webkit-scrollbar {
    width: 2px;
    padding: 10px 0;
    background-color: #1d1d1d;
}

.message-content-ows::-webkit-scrollbar-thumb {
    background-color: #615f5f60;
}

.onewise-btn-chat-input textarea::-webkit-scrollbar {
    width: 2px;
    padding: 10px 0;
    background-color: #f7f7f7;
}

.onewise-btn-chat-input textarea::-webkit-scrollbar-thumb {
    background-color: #b4b0b060;
}

/* plugin */
.plugin {
    width: calc((100% / 3) - 7px);
    max-width: 200px;
    min-height: 120px;
    padding: 3px;
}

.plugin-content {
    padding: 20px 8px;
    background: #3e3e3e3a;
    border-radius: 5px;
    cursor: pointer;
    height: calc(100% - 6px);
}

.plugin-content p {
    font-size: 0.9em;
}

.wel img {
    border-radius: 50%;
}
</style>