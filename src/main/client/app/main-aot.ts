import { enableProdMode } from "@angular/core";
import { platformBrowser } from "@angular/platform-browser";
import { AppMoudleNgFactory } from "./app.module.ngfactory";

enableProdMode();
const platform = platformBrowser();
platform.bootstrapModuleFactory(AppMoudleNgFactory);