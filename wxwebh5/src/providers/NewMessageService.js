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
var http_1 = require("@angular/http");
var HttpService_1 = require("./HttpService");
var StorageService_1 = require("./StorageService");
var NewMessageService = (function () {
    function NewMessageService(http, httpService, storageService) {
        this.http = http;
        this.httpService = httpService;
        this.storageService = storageService;
    }
    NewMessageService.prototype.getList = function () {
        var url = '/H5MasterListAll';
        return this.httpService.httpGetNoAuth(url);
        /*    const Masteres: NewMessageModel[] = [
                { id: 11, mastername: 'Mr. Nice', picurl: '', profiles: '' },
                { id: 12, mastername: 'Narco', picurl: '', profiles: '' },
                { id: 13, mastername: 'Bombasto', picurl: '', profiles: '' },
                { id: 14, mastername: 'Celeritas', picurl: '', profiles: '' },
                { id: 15, mastername: 'Magneta', picurl: '', profiles: '' },
                { id: 16, mastername: 'RubberMan', picurl: '', profiles: '' },
                { id: 17, mastername: 'Dynama', picurl: '', profiles: '' },
                { id: 18, mastername: 'Dr IQ', picurl: '', profiles: '' },
                { id: 19, mastername: 'Magma', picurl: '', profiles: '' },
                { id: 20, mastername: 'Tornado', picurl: '', profiles: '' }
            ];
            return Masteres;
            */
    };
    return NewMessageService;
}());
NewMessageService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, typeof (_a = typeof HttpService_1.HttpService !== "undefined" && HttpService_1.HttpService) === "function" && _a || Object, typeof (_b = typeof StorageService_1.StorageService !== "undefined" && StorageService_1.StorageService) === "function" && _b || Object])
], NewMessageService);
exports.NewMessageService = NewMessageService;
var _a, _b;
//# sourceMappingURL=NewMessageService.js.map