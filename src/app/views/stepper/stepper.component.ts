import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { DataService } from 'src/app/common/services/data.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  activeStep: number = 0;

  modalState = 0;
  isRetake: boolean = false;
  videoParts!: Blob[];
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];

  state = ["Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry"]

  // private emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  // private phonePattern = /^\+{0,2}([\-\. ])?(\(?\d{0,3}\))?([\-\. ])?\(?\d{0,3}\)?([\-\. ])?\d{3}([\-\. ])?\d{4}/;
  isLoading: boolean = false;
  userFormGroup: FormGroup | any;
  certificateFormGroup: FormGroup | any;
  finalFormSubmitted: boolean = false
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.userFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      // age: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required,]),
    });

    this.certificateFormGroup = new FormGroup({
      state: new FormControl('', [Validators.required]),
      age: new FormControl(null, [Validators.required, Validators.max(150), Validators.min(0)])
    });
  }

  public get userForm(): FormGroup {
    return this.userFormGroup as FormGroup;
  }

  public get certificateForm(): FormGroup {
    return this.certificateFormGroup as FormGroup;
  }

  submit() {
    try {
      this.isLoading = true;
      this.dataService.UserData = this.userFormGroup.value;
      this.dataService.submitData();
      this.navigateStep(1);
    } catch (e) {
      console.error(e);
    }
  }

  navigateStep(n: number) {
    if (n > 0) {
      this.activeStep++;
    }
    else {
      this.activeStep--;
    }
  }


  goToDownloadCertificateView() {
    this.navigateStep(1);
  }

  deleteVideo() {
    this.isRetake = true;
    this.videoParts = [];
  }

  triggerUploading() {
    if (this.videoParts) {
      this.modalState = 0;
      setTimeout(() => {
        this.modalState = 1;
      }, 5000);
      this.dataService.uploadVideo(this.videoParts);
    }
  }

  handleData(ev: Blob[]) {
    if (ev) {
      this.videoParts = ev;
    }
  }

  enableCertificate() {
      this.finalFormSubmitted = true;
  } 

  downloadCertificate(number: number) {
      console.log(this.certificateForm.value, this.dataService.getUserData);

  }
}
