import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  stepCount = 0;
  constructor(private dataService: DataService) {
      this.dataService.stepperSubject.subscribe(stepper => {
          this.stepCount = stepper;
      })
  }
}
