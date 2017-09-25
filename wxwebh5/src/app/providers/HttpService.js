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
var Observable_1 = require("rxjs/Observable");
var http_2 = require("@angular/http");
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
var StorageService_1 = require("./StorageService");
// import { UserInfoData } from "./../model/UserInfoData";
var AppGlobal_1 = require("../AppGlobal");
var HttpService = (function () {
    function HttpService(http, storageService) {
        this.http = http;
        this.storageService = storageService;
        this.localhost = AppGlobal_1.AppGlobal.getInstance().localhost;
        // this.local = new Storage(LocalStorage);
    }
    HttpService.prototype.httpGetWithAuth = function (url) {
        //  let user = this.storageService.read<UserInfoData>('UserInfo');
        //  var headers = new Headers();
        //  headers.append('Content-Type', 'application/json');
        //  headers.append('Authorization', user.ID + '-' + user.UserToken);
        //  let options = new RequestOptions({ headers: headers });
        //  return this.http.get(url, options).toPromise()
        //      .then(res => res.json())
        //      .catch(err => {
        //          this.handleError(err);
        //      });
    };
    HttpService.prototype.httpGetNoAuth = function (url) {
        var _this = this;
        var headers = new http_2.Headers();
        headers.append('Content-Type', 'application/json');
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.get(this.localhost + url, options).toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (err) {
            _this.handleError(err);
        });
        /*  return this.http.get(this.localhost + url).toPromise()
          .then(res => res.json())
          .catch(err => {
              this.handleError(err);
          }); */
    };
    HttpService.prototype.httpPostNoAuth = function (url, body) {
        var _this = this;
        var headers = new http_2.Headers();
        headers.append('Content-Type', 'application/json');
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.post(this.localhost + url, body, options).toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (err) {
            _this.handleError(err);
        });
    };
    // public httpPostWithAuth(body: any, url: string) {
    //     return this.myInfoLocal = this.local.getJson('UserInfo')
    //         .then((result) => {
    //             var headers = new Headers();
    //             headers.append('Content-Type', 'application/json');
    //             headers.append('Authorization', result.ID + '-' + result.UserToken);
    //             let options = new RequestOptions({ headers: headers });
    //             return this.http.post(url, body, options).toPromise();
    //         });
    // }
    HttpService.prototype.handleError = function (error) {
        console.log(error);
        return Observable_1.Observable.throw(error.json().error || 'Server Error');
    };
    return HttpService;
}());
HttpService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        StorageService_1.StorageService])
], HttpService);
exports.HttpService = HttpService;
//# sourceMappingURL=HttpService.js.map