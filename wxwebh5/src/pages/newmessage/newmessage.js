"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var NewMessageService_1 = require("../../providers/NewMessageService");
var NewMessageComponent = (function () {
    function NewMessageComponent(newmessageService) {
        this.newmessageService = newmessageService;
        // this.newmessageService.getList().then(data => {
        // alert(JSON.stringify(data));
        //  this.items = data.Apps;
        // });
        this.items = this.newmessageService.getList();
    }
    return NewMessageComponent;
}());
NewMessageComponent = __decorate([
    core_1.Component({
        // selector: 'newmessage',
        templateUrl: './newmessage.html',
        styleUrls: ['../../../../css/weui.min.css', './newmessage.css'],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof NewMessageService_1.NewMessageService !== "undefined" && NewMessageService_1.NewMessageService) === "function" && _a || Object])
], NewMessageComponent);
exports.NewMessageComponent = NewMessageComponent;
var _a;
//# sourceMappingURL=newmessage.js.map