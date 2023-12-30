import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './stepper.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from 'src/app/common/header/header.component';
import { LogoComponent } from 'src/app/common/logo/logo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VideoCaptureComponent } from 'src/app/common/video-capture/video-capture.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

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
    LogoComponent,
    VideoCaptureComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgxIntlTelInputModule
  ]
})
export class StepperModule { }
