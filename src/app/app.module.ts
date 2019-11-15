import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { MainGridComponent } from './main-grid/main-grid.component';
import {HttpClientModule} from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import 'ag-grid-enterprise';

@NgModule({
  declarations: [
    AppComponent,
    MainGridComponent,
    HeaderComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents([ToolbarComponent, HeaderComponent])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
