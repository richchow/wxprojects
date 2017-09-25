//import {UserInfo} from './model/user';
"use strict";
/**
 * AppGlobal 全局定义 单例模式
 */
var AppGlobal = (function () {
    function AppGlobal() {
        /**自己加的全局变量 */
        this.isLogin = false;
        /**是否是调试状态 */
        this.isDebug = true;
        this.server = this.isDebug ? 'http://192.168.1.2:8089' : 'http://h5.xxx.com';
        this.apiUrl = '';
        this.localhost = this.server + this.apiUrl;
        /**当前用户信息 */
        // currentUserInfo: UserInfo = new UserInfo();
        /**分页页数 */
        this.pageSize = 10;
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
    AppGlobal.getInstance = function () {
        return AppGlobal.instance;
    };
    return AppGlobal;
}());
AppGlobal.instance = new AppGlobal();
exports.AppGlobal = AppGlobal;
//# sourceMappingURL=AppGlobal.js.map