import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _userData: BehaviorSubject<any> = new BehaviorSubject(null);
  private appUrl: string = environment.appUrl;
  private isFormSubmit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private videoUploadUrl!: string;
  private profileId!: string;
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

  public submitData(payload?:any) {
    const body = payload || JSON.parse(JSON.stringify(this._userData.value));
    if(!payload){
      body.phone = body.phone.number;
    }
    else{
      body.profileId = this.profileId;
    }

    console.log(navigator.userAgent);

    if (navigator.userAgent.indexOf('Safari') > -1 && !navigator.userAgent.includes('Chrome')) {
      body['videoFormat'] = 'mp4';
    } else {
      body['videoFormat'] = 'webm'
    }
    const options = {
      'x-api-key': environment.userToken,
    }
    return this._http.post(this.appUrl, body, {headers: options});
  }

  public uploadFile(body:any){
    const options = {
      'x-api-key': environment.userToken,
      'Content-Type': 'binary/octet-stream'
    }
    console.log(this.profileId);
    return this._http.put(this.videoUploadUrl, body, {headers: options});
  }

  storeVideoUrl(signedUrl:string, profileId:string){
    this.videoUploadUrl = signedUrl;
    profileId && (this.profileId = profileId);
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



   public async uploadVideo(videoObject: any) {
      // if (videoObject) {
      //   // Object.keys(this.s3headerObject).forEach(key => {
      //     //   formData.append(key, this.s3headerObject[key]);
      //     // });
      // }



      const formData = new FormData();

      var fileFromBlob = new File([videoObject], 'videoJSR.webm');
      formData.append('file', fileFromBlob);
      const options = { 'Content-Type': 'binary/octet-stream' };
      // console.log(formData);
      return this._http.put(this.videoUploadUrl, formData, {headers: options});
  }
}
