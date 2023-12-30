import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './stepper.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from 'src/app/common/header/header.component';
import { LogoComponent } from 'src/app/common/logo/logo.component';

const routes:Routes = [
  {
    path: '',
    component: StepperComponent
  }
]

@NgModule({
  declarations: [
    StepperComponent,
    HeaderComponent,
    LogoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class StepperModule { }
