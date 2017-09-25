"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./app.component");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
/* newmessage*/
var newmessage_1 = require("./pages/newmessage/newmessage");
/*注册服务 */
var HttpService_1 = require("./providers/HttpService");
var StorageService_1 = require("./providers/StorageService");
var NewMessageService_1 = require("./providers/NewMessageService");
var appRoutes = [
    { path: 'newmessage', component: newmessage_1.NewMessageComponent },
    { path: '', component: app_component_1.AppComponent },
];
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            http_1.HttpModule,
            platform_browser_1.BrowserModule,
            router_1.RouterModule.forRoot(appRoutes, { enableTracing: true } // <-- debugging purposes only
            )
        ],
        providers: [
            HttpService_1.HttpService,
            StorageService_1.StorageService,
            NewMessageService_1.NewMessageService
        ],
        declarations: [
            app_component_1.AppComponent,
            newmessage_1.NewMessageComponent
        ],
        bootstrap: [app_component_1.AppComponent],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map