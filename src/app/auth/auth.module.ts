import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RecoverpassComponent } from './recoverpass/recoverpass.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OptionselectComponent } from './recoverpass/optionselect/optionselect.component';
import { ValidatesecuritycodeComponent } from './recoverpass/validatesecuritycode/validatesecuritycode.component';
import { ChangepassComponent } from './recoverpass/changepass/changepass.component';
import { PrimerAccesoComponent } from './login/primer-acceso/primer-acceso.component';



@NgModule({
  declarations: [
    LoginComponent,
    RecoverpassComponent,
    OptionselectComponent,
    ValidatesecuritycodeComponent,
    ChangepassComponent,
    PrimerAccesoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
