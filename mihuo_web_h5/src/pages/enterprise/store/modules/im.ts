import store from '../index'
import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { appStore } from '_@/store/modules/app'
import wsCache from '@/cache'
import ItemVue from '../../layout/components/Sider/Item.vue'
const imsdk = require('@/xsoftimsdk.js')
export interface ImState {
    websocket: any
    toUser: Object
    size: Number,
    sessionList: Object[],
    userList: Object[],
    num: Number,
    requestIm: Object,
    normalMessageList: Object[],
    groupMessageList: Object[],
    imShow: Boolean,
    isNewMessage: Boolean,
}

@Module({ dynamic: true, namespaced: true, store, name: 'imstore' })
class Im extends VuexModule implements ImState {
    public websocket = '' as any
    public toUser = { TargetId: 0, Message: [] as any }
    public size = 30
    public requestIm = { onWsData: '' as any, initMessageCallback: '' as any, getWsConnetc: '' as any }
    public sessionList = [] as any[]
    public num = 1
    public normalMessageList = [] as any[]
    public groupMessageList = [] as any[]
    public userList = [] as any[];
    public imShow: boolean = false;
    public isNewMessage: boolean = false;
    //消息撤回
    @Mutation
    private Recall_Message(data: any): void {
        const { sourceId, messageId, targetId, isGroup } = data
        // 需要先判断这个消息是谁撤回的
        // 会话查找
        let user = wsCache.get(appStore.userInfoDetail)
        let userImid = user.sysUser.imId || 0
        const target = isGroup ? targetId : userImid == sourceId ? targetId : sourceId;
        console.log(userImid, target)
        const index = this.sessionList.findIndex((item: any) => item.TargetId == target);
        //消息查找
        const message = this.sessionList[index].Message;
        console.log(message)
        if (!message.length) {
            this.sessionList[index].Message.push({
                Id: messageId,
                Type: imsdk.enums.ContentType.ReCall,
                SourceId: sourceId,
                TargetId: targetId
            })
        } else {
            //查找撤回的消息
            const findMessageIndex = this.sessionList[index].Message.findIndex((item: any) => item.Id == messageId)
            console.log(findMessageIndex)
            if (findMessageIndex > -1) {
                const recallmessage = this.sessionList[index].Message[findMessageIndex]
                recallmessage.Type = imsdk.enums.ContentType.ReCall;
                this.sessionList[index].Message[findMessageIndex] = recallmessage
            } else {
                this.sessionList[index].Message.push({
                    Id: messageId,
                    Type: imsdk.enums.ContentType.ReCall,
                    SourceId: sourceId,
                    TargetId: targetId
                })
            }
        }
    }
    @Mutation
    private Set_requestIm(Object: any): void {
        this.requestIm = Object;
    }
    @Mutation
    private Set_ImShow(show: any): void {
        this.imShow = show;
    }
    @Mutation
    private Set_Webscoket(scoket: any): void {
        this.websocket = scoket
    }
    @Mutation
    private Get_SessionList(data: any): void {
        this.sessionList = data.map((item: any) => ({ ...item, Message: [] }));
    }
    @Mutation
    private Set_IsNewMessage(isNewMessage: any) {
        this.isNewMessage = isNewMessage;
    }
    @Mutation
    private Change_SessionList(session: any): void {
        const index = this.sessionList.findIndex((item: any) => item.TargetId == session.TargetId);
        if (index > -1) {
            this.sessionList[index] = { ...this.sessionList[index], ...session }
            this.sessionList.sort((a: any, b: any) => (b.ChangeTime - a.ChangeTime))
        } else {
            this.sessionList.unshift({ ...session, Message: [] });
        }
    }
    @Mutation
    private Set_ToUser(data: any): void {
        this.num = 1;
        this.toUser = data;
        this.normalMessageList = [];
        this.groupMessageList = [];
    }
    @Mutation
    private Load_NormalMessageList(data: any): void {
        console.log('set1', data);
        let user = wsCache.get(appStore.userInfoDetail)
        let userImid = user.sysUser.imId || 0
        if (this.isNewMessage) {
            //数据的更新
            const { TargetId } = this.toUser;
            const index = this.sessionList.findIndex((item: any) => (item.TargetId == TargetId || item.TargetId == data[0].SourceId));
            //this.sessionList[index].Message = this.sessionList[index].Message.filter((item: any) => item.Id != data.Id)
            this.sessionList[index].Message.push(...data);
            this.isNewMessage = false;
            return;
        }
        //消息的加载  加载的时候 消息只能是加载当前已经选中的用户的信息
        const { TargetId } = this.toUser;
        const index = this.sessionList.findIndex((item: any) => item.TargetId == TargetId);
        this.sessionList[index].Message = [...data, ...this.sessionList[index].Message];
    }
    @Mutation
    private Load_GroupMessageList(data: any): void {
        if (this.isNewMessage) {
            const index = this.sessionList.findIndex((item: any) => item.TargetId == data[0].GroupId);
            this.sessionList[index].Message.push(...data);
            this.isNewMessage = false;
            return;
        }
        const index = this.sessionList.findIndex((item: any) => item.TargetId == data[0].GroupId);
        this.sessionList[index].Message = [...data, ...this.sessionList[index].Message];
    }
    @Mutation
    private Get_UserList(data: any): void {
        this.userList = [...this.userList, ...data];
    }
    @Mutation
    private Add_SessionList(data: any): void {
        const session = [...data, ...this.sessionList]
        this.sessionList = session.map((item: any) => ({ ...item, Message: [] }));
    }
    @Mutation
    private Log_Out() {
        this.websocket.close();
        this.websocket = '';
        this.toUser = { TargetId: 0, Message: [] as any }
        this.sessionList = [];
        this.num = 1
        this.normalMessageList = []
        this.groupMessageList = []
        this.imShow = false;
        this.isNewMessage = false;
    }
    @Action
    public SetRequestIm(o: any): void {
        this.Set_requestIm(o)
    }
    @Action
    public SetWebScoket(scoket: any): void {
        this.Set_Webscoket(scoket)
    }
    @Action
    public GetSessionList(data: any): void {
        this.Get_SessionList(data);
    }
    @Action
    public ChangeSession(session: any): void {
        this.Change_SessionList(session)
    }
    @Action
    public AddSessionList(data: any): void {
        this.Add_SessionList(data);
    }
    @Action
    public SetToUser(data: any): void {
        this.Set_ToUser(data)
    }
    @Action
    public LoadNormalMessageList(data: any): void {
        this.Load_NormalMessageList(data)
    }
    @Action
    public LoadGroupMessageList(data: any): void {
        this.Load_GroupMessageList(data)
    }
    @Action
    public RecallMessage(Object: any): void {
        this.Recall_Message(Object)
    }
    @Action
    public GetUserList(data: any): void {
        this.Get_UserList(data);
    }
    @Action
    public SetImShow(show: any): void {
        this.Set_ImShow(show)
    }
    @Action
    public SetIsNewMessage(isNewMessage: any) {
        this.Set_IsNewMessage(isNewMessage);
    }
    @Action
    //退出登录
    public Logout() {
        this.Log_Out()
    }
}
export const ImStore = getModule<Im>(Im)
