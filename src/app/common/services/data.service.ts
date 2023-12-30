import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/enviornments/enviornment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _userData: BehaviorSubject<any> = new BehaviorSubject(null);
  private appUrl: string = environment.appUrl;
  private isFormSubmit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private videoUploadUrl!: string;
  private s3headerObject: any = {} as any;
  constructor(private _http: HttpClient) { }

  public get getUserData(): any {
    return this._userData.value;
  }

  public set UserData(data: any) {
    this._userData.next(data);
  }

  public get getUser(): BehaviorSubject<any> {
      return this._userData;
  }

  public get isFormSubmitted(): BehaviorSubject<boolean> {
    return this.isFormSubmit;
  }

  public submitData() {
    try {
        const body = JSON.parse(JSON.stringify(this._userData.value));
        body.phone = body.phone.number;
        const options = {
          'x-api-key': environment.userToken,
        }
        this._http.post(this.appUrl,body, {
          headers: options,
        }).subscribe((data:any) => {
        
        this.videoUploadUrl = data['signedUrl'];
              
        // this.processUrl(data['signedUrl']);
        this.isFormSubmitted.next(true);
        });
    } catch (e) {
      console.error(e)
    }
  }

  processUrl(url: string) {
    try {
      const parts = url.split('?');
      this.videoUploadUrl = parts[0];
      const headers = parts[1].split('&');
      headers.forEach(str => {
          this.s3headerObject[str.split('=')[0]] =  str.split('=')[1];
      })
      
    } catch (e) {
      console.log(e);
    }

  }

  public uploadVideo(videoObject: any) {
      if (videoObject) {
        const formData = new FormData();
        
        // Object.keys(this.s3headerObject).forEach(key => {

        //   formData.append(key, this.s3headerObject[key]);
        // });


        formData.append('file', videoObject);
        

        this._http.put(this.videoUploadUrl,formData).subscribe((data:any) => {
            console.log(data);
        });
      }
  }
}
