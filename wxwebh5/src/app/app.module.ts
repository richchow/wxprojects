import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
/* newmessage*/
import { NewMessageComponent } from './pages/newmessage/newmessage';
/*注册服务 */
import {HttpService} from './providers/HttpService';
import {StorageService} from './providers/StorageService';
import { NewMessageService } from './providers/NewMessageService';


const appRoutes: Routes = [
  { path: 'newmessage', component: NewMessageComponent },
  { path: '', component: AppComponent },
];

@NgModule({
  imports: [
    HttpModule,
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
    HttpService,
    StorageService,
    NewMessageService
  ],
  declarations: [
    AppComponent,
    NewMessageComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
