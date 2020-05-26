import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WebAudioModule } from '@ng-web-apis/audio'

import { AppComponent } from './components/app/app.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    KeyboardComponent,
    LandingPageComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatButtonModule,
    WebAudioModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
