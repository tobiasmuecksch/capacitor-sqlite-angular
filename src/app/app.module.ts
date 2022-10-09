import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SqliteOfficialService } from './services/sqlite-official.service';
import { SqliteService } from './services/sqlite.service';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
    providers: [SqliteService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SqliteService, SqliteOfficialService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }