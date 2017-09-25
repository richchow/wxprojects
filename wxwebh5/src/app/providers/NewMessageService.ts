import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { HttpService } from "./HttpService";
import { StorageService } from "./StorageService";

import { NewMessageModel} from "../models/newmessageModel";

@Injectable()

export class NewMessageService {

    constructor(
        private http: Http,
        private httpService: HttpService,
        private storageService: StorageService) { }

    getList() {
        let url = '/H5MasterListAll';
         return this.httpService.httpGetNoAuth(url);
    }

}