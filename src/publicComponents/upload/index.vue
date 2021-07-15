<template>
    <div
    :style="`width:` + width + `;margin-top:` + top"
    >
        <div
        :style="`height:` + height + `; width:` + width"
        :class="'upload ' + (image ? '' : 'upload_border')" 
        v-loading="loading"
        >   
            <div v-if="image" class="clear iconfont icon-icon-test" @click="onClear"></div>
            <img v-if="image" :src="HOST + '/' + image" alt="图片">
            <div v-else class="icon-wrap">
                <span class="icon iconfont icon-add" @click="selectImg"></span>
                <span class="paizhao iconfont icon-paizhao" @click="togglePhotographToast(true)"></span>
            </div>
            <input ref="upload-select-file" type="file" style="display: none">
        </div>
        <div v-if="!disabledAspectRatioTips && aspectRatio !== 0" class="aspectratio-tips">宽高比{{aspectRatio}}</div>

        <!-- 拍照组件 -->
        <el-dialog
        title="拍照"
        :visible="photographToast.show"
        width="440px"
        top="200px"
        :append-to-body="true"
        @close="togglePhotographToast(false)"
        >
            <canvas width="400" height="400" ref="canvas"/>
            <video ref="video" style="display: none"/>
            <el-button @click="photograph">拍照</el-button>
        </el-dialog>

    </div>
</template>
<script>
import request from "../../tools/request";
export default { 
    props: {
        height: {
            type: String,
            default: "100px"
        },
        width: {
            type: String,
            default: "100px"
        },
        top: {
            type: String,
            default: "40px"
        },
        // 宽高比
        aspectRatio: {
            type: String,
            default: 0 /* 0为缺省表示不检测， 可选参数为字符 “x:y” 来约束宽高比，比如 “1:2” */
        },
        // 不显示宽高比提示
        disabledAspectRatioTips: {
            type: Boolean,
            default: false,
        },
        //图像地址
        value: {
            type: String,
            default: ""
        }
    },
    data () {
        return {
            HOST: ENV.HOST + "/static",
            loading: false,
            MAX_SIZE: 2,
            image: "",
            photographToast: {
                show: false,
                canvas: null,
                mediaStream: null,
                timer: 0
            }
        }
    },
    mounted () {
        this.image = this.value;
    },
    watch: {
        value: function (n, o) {
            if (n !== o) this.image = n;
        }
    },
    methods: {

        onClear () {
            this.image = "";
            this.$emit("input", "");
        },

        async togglePhotographToast (is = false) {
            const _ = this.photographToast;
            if (is) {
                _.show = true;
                this.$nextTick(() => {
                    this.prePhotograph();
                });
            } else {
                _.mediaStream && _.mediaStream.getTracks().forEach(track => track.stop());
                _.show = false;
            }
        },

        async prePhotograph () {    
            const _ = this.photographToast;
            _.canvas = this.$refs.canvas;
            let 
                video = this.$refs.video,
                ctx = _.canvas.getContext("2d");
            try {
                _.mediaStream = await navigator.mediaDevices.getUserMedia({ video: { height: 700, width: 700 } });
            } catch (err) {
                console.log(err);
                return this.$message.error("您的浏览器不支持摄像头，暂时无法使用拍照功能！");
            }
            video.srcObject = _.mediaStream;
            video.play();
            _.timer = setInterval(() => {
                ctx.drawImage(video, 0, 0, 400, 400);
            }, 28.5);
        },

        photograph () {
            const 
                canvas = this.photographToast.canvas, 
                timer = this.photographToast.timer,
                mediaStream = this.photographToast.mediaStream;
            clearInterval(timer);
            mediaStream.getTracks().forEach(trck => trck.stop());
            canvas.toBlob(blob => {
                canvas.getContext("2d").clearRect(0, 0, 400, 400);
                const file = new File([blob], "1.png");
                this.requestUpload(file);
                this.togglePhotographToast(false);
            });
        },

        //选择图片
        selectImg () {
            const input = this.$refs["upload-select-file"];
            if (!input.onchange) {
                input.onchange = async ({target: {files:[file]}}) => {
                    input.value = "";
                    if ((file.size / 1024 / 1024) > this.MAX_SIZE) {
                        this.$message.warning("图片不能大于2MB");
                        return;
                    }
                    if (await this.checkImageAspectRatio(URL.createObjectURL(file))) {
                        this.requestUpload(file);
                    }
                }
            }
            input.click();
        },
        //请求上传图片
        requestUpload (file) {
            const data = new FormData();
            data.append("file", file);
            this.loading = true;
            request({
                headers: {
                    "Content-Type": "multipart/form-data"
                },  
                url: "/upload",
                method: "POST",
                data
            })
            .then(async data => {
                this.loading = false;
                if (!data.success) {
                    this.$message.error(data.message || "系统错误");
                    return;
                }
                const path = data.data;
                this.image = path;
                this.$emit("input", path);
            })
            .catch(err => {
                this.loading = false;
            });
        },
        // 检查图片宽高比
        // param {String} url 图片地址
        // return {Promise<Boolean>}
        async checkImageAspectRatio (url) {
            if (this.aspectRatio === 0) {
                return true;
            }
            const img = document.createElement("img"), [aspectRatioW, aspectRatioH] = this.aspectRatio.split(":");
            let imgH, imgW;
            img.src = url;
            img.style.opacity = "0";
            document.body.appendChild(img);
            await new Promise(resolve => {
                img.onload = () => {
                    imgH = img.offsetHeight, imgW = img.offsetWidth;
                    resolve();
                }
            });
            document.body.removeChild(img);
            if (imgW / aspectRatioW * aspectRatioH === imgH) {
                return true;
            } else {
                this.$alert(`当前图片宽高比要求${this.aspectRatio}；而您上传的尺寸为宽${imgW}像素，高${imgH}像素；不符合要求的宽高比！请严格按照宽高比上传！`, `图片宽高比不合规！`, {
                    confirmButtonText: '确定'
                });
                return false;
            }
        }
    }
}
</script>
<style lang="less" scoped>
.upload {
    // height: js;
    // width: js;
    // margin-top: js;
    position: relative;
    .icon-wrap {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 16px;
        box-sizing: border-box;
    }
    img {
        height: 100%;
        width: 100%;
    }
    .clear {
        position: absolute;
        height: 25px; width: 25px;
        line-height: 25px;
        text-align: center;
        border-radius: 50%;
        font-size: 8px;
        color: white;
        background: rgba(0,0,0,0.5);
        right: -15px; top: -15px;
    }
    .icon, .paizhao  {
        cursor: pointer;
    }
    .paizhao {
        font-size: 20px;
    }

}
.aspectratio-tips {
    color: red;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
}
.upload_border {
    border: 1px dashed grey;
    border-radius: 5px;
}
canvas {
    border: 1px solid red;
}
</style>