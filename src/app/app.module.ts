
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@NgModule({
    declarations: [],
    imports: [
        BrowserModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule
    ],
    providers: [],
})
export class AppModule {}


//import { CommonModule } from "@angular/common";
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';