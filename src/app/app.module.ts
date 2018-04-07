import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatDialogModule, MatInputModule, MatButtonModule, MatTableModule } from '@angular/material';


import { AppComponent } from './app.component';
import { HorizontalDialogComponent } from './dialogs/horizontal.dialog';
import { AppServiceService } from './app-service.service';
import { BuilderService } from './service/builder.service';


@NgModule({
  declarations: [
    AppComponent,
    HorizontalDialogComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [AppServiceService, BuilderService],
  entryComponents: [
    HorizontalDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
