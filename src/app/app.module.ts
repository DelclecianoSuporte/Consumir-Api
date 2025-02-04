
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./app.routes";
import { FilmeService } from "./Filme.service";

@NgModule({
    declarations: [],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    providers: [FilmeService]
})
export class AppModule {}