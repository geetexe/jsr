import { Component } from '@angular/core';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  activeStep:number = 0;

  modalState = 0;

  navigateStep(n:number){
    if(n > 0){
      this.activeStep++;
    }
    else{
      this.activeStep--;
    }
  }

  triggerUploading(){
    this.modalState = 0;
    setTimeout(() => {
      this.modalState = 1;
    }, 5000);
  }

  goToDownloadCertificateView(){
    this.navigateStep(1);
  }

}
