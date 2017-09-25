//import {UserInfo} from './model/user';

/**
 * AppGlobal 全局定义 单例模式
 */
export class AppGlobal {
    private static instance: AppGlobal = new AppGlobal();

/**自己加的全局变量 */
isLogin: boolean = false;

    /**是否是调试状态 */
    isDebug: boolean = true;
    server: string = this.isDebug ? 'http://192.168.0.104:8089' : 'http://h5.xxx.com';

    apiUrl: string = '';

    localhost: string = this.server + this.apiUrl;

    /**当前用户信息 */
   // currentUserInfo: UserInfo = new UserInfo();
    /**分页页数 */
    pageSize: number = 10;

    constructor() {
        if (AppGlobal.instance) {
            throw new Error("错误: 请使用AppGlobal.getInstance() 代替使用new.");
        }
        AppGlobal.instance = this;
    }

    /**
     * 获取当前实例
     * 
     * @static
     * @returns {AppGlobal}
     */
    public static getInstance(): AppGlobal {
        return AppGlobal.instance;
    }
}