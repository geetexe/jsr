import { Component } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { DataService } from 'src/app/common/services/data.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  activeStep: number = 0;

  modalState = 0;
  isRetake: boolean = false;
  videoParts!: any;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
  username!: string;

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
  englishCertificate!: boolean;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.userFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), this.validateSpecialChar]),
      // age: new FormControl('', [Validators.required]),
      // phone: new FormControl('', [Validators.required, this.validateSpecialChar]),
    });

    this.certificateFormGroup = new FormGroup({
      state: new FormControl('', [Validators.required]),
      age: new FormControl(null, [Validators.required, Validators.max(150), Validators.min(0)])
    });
  }

  validateSpecialChar(control: FormControl): ValidationErrors| null {
    if (control.value) {
      let value = control.value;
      return  /^[a-zA-Z\u0901-\u097F ]+$/.test(value) ? null :  {'invalidChar': true};
      
    }
    return null;
  }

  public get userForm(): FormGroup {
    return this.userFormGroup as FormGroup;
  }

  public get certificateForm(): FormGroup {
    return this.certificateFormGroup as FormGroup;
  }

  submit() {
    this.isLoading = true;
    this.dataService.UserData = this.userFormGroup.value;
    this.dataService.submitData().subscribe(
      (res: any) => {
        this.isLoading = false;
        this.dataService.storeVideoUrl(res?.['signedUrl'], res?.['profileId']);
        this.navigateStep(1);
      }
    );
  }

  navigateStep(n: number) {
    this.activeStep += n;
    this.dataService.stepperSubject.next(this.activeStep);
  }


  goToDownloadCertificateView() {
    this.navigateStep(1);
  }

  deleteVideo() {
    this.isRetake = true;
    this.videoParts = [];
  }

  async triggerUploading() {
    if (this.videoParts) {
      this.modalState = 0;

      const { src }: any = document.querySelector("video.video.isVisible");

      let blob = null;
      let file = null;
      await fetch(src).then(async res => {
        blob = await res?.blob();

        file = new File([blob], 'file', { type: 'video/x-matroska' });
        let container = new DataTransfer();
        container.items.add(file);

        const formData = new FormData();
        formData.append('file', blob);
        this.dataService.uploadFile(formData).subscribe(
          (res: any) => {
            this.modalState = 1;
          },
          err => {
            console.log(err);
          }
        )
      })

    }
  }

  handleData(ev: Blob[]) {
    if (ev) {
      this.videoParts = ev;
    }
  }

  enableCertificate() {
    this.finalFormSubmitted = false;
    this.username = this.dataService.getUserData.name;
    this.dataService.submitData(this.certificateFormGroup.value).subscribe(
      (res: any) => {
        this.finalFormSubmitted = true;
      }
    )
    let bottom = document.body.scrollHeight + 100;
    window.scrollTo(0, bottom);
  }

  recordedVideo: any = null;
  onRecordCompletion(ev: any) {
    this.recordedVideo = ev.resBlob;
    // console.log(this.recordedVideo);
  }

  downloadCertificate(number: number) {

    const src = !number ? '/assets/img/certificate-hindi.jpg' : "/assets/img/certificate-English.jpg";


    const popupWin = window.open('', '_blank', 'width=600,height=600');
    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
          <html>
            <head>
              <title>Print</title>
              <style>

              .your-name{
                position: absolute;
                left: 0;
                right: 0;
                top: 34%;
                width: 843px;
                text-align: center;
                font-size: 32px;
                font-weight: 600;
                background: transparent;
                color: #EB6A23;
                -webkit-background-clip: text;
                /* -webkit-text-fill-color: transparent; */
            }
            .your-certificate{
                position: relative;
                width: 843px;
                margin: auto;
            }
                img{
                    width: 100%;
                    height: auto;
                }

                .certificate {
                  border-radius: 24px;
                  background: #FFF;
                  padding: 20px;
                  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.04), 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
                  width: 100%;
              }
                // Add any additional styles for printing
              </style>
            </head>
            <body">
              <div class="your-certificate">
              <img src="${src}" class="img-fluid certificate" /> 
               <span class="your-name">${this.username}</span>
             </div>
            </body>
          </html>
        `);
      popupWin.document.close();

    html2canvas(popupWin.document.body).then((canvas: any) => {
      const image = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = image;
      link.download = 'certificate.png';

      link.click();
    });
    }
  }

}
