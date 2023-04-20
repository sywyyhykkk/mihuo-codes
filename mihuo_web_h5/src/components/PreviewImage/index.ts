import { createApp } from "vue";
import PreviewImage from "./PreviewImage.vue"
export default function(srcList:any,current:any){
    const div = document.createElement('div')
    const app = createApp(PreviewImage,{srcList,current,onClose:()=>{
        div.remove();
        app.unmount()
    }})
    app.mount(div)  
    // 样式无效
    div.style.display = 'contents'
    document.body.append(div)
}