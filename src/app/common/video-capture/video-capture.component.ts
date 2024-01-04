import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var MediaRecorder: any;
@Component({
  selector: 'app-video-capture',
  templateUrl: './video-capture.component.html',
  styleUrls: ['./video-capture.component.scss']
})
export class VideoCaptureComponent implements OnInit, OnDestroy {
  @ViewChild('recordedVideo') recordVideoElementRef!: ElementRef;
  @ViewChild('video') videoElementRef!: ElementRef;
  @Input() isRetake: boolean = false;
  @Output() isRetakeComplete: EventEmitter<any> = new EventEmitter<any>();
  @Output() isRecorded: EventEmitter<Blob[]> = new EventEmitter<Blob[]>();

  videoForm!: FormGroup;
  @ViewChild('videoRef') videoRef!: ElementRef;

  videoElement!: HTMLVideoElement;
  recordVideoElement!: HTMLVideoElement;
  mediaRecorder: any;
  recordedBlobs!: Blob[];
  isRecording: boolean = false;
  downloadUrl!: string;
  stream!: MediaStream;
  showPreview: boolean = true;
  isRecordCompelte: boolean = false;

  constructor(private dataService: DataService, private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['isRetake'].currentValue) {
      this.showPreview = true;
      this.isRecordCompelte = false;
      this.isRecorded.emit([]);
      this.recordedBlobs = [];
      this.ngOnInit();
      this.isRetakeComplete.emit(false);
    }
  }

  ngOnDestroy(): void {
      if (this.stream) {
        this.stream.getTracks() && this.stream.getTracks().forEach(track => {
            track.stop();
        });
      }
  }

  async ngOnInit() {
    this.videoForm = this.fb.group({
      video: [null]
    });
    let width = document.getElementById('video-1')?.clientWidth;
    if ('navigator' in window) {
      navigator.mediaDevices
      .getUserMedia({
        video: {
          height: 400,
          width: 400,

        },
        audio: {
          noiseSuppression: true
        }
      })
      .then((stream) => {

        this.videoElement = this.videoElementRef!.nativeElement;
        this.recordVideoElement = this.recordVideoElementRef!.nativeElement;

        this.stream = stream;
        this.videoElement.srcObject = this.stream;
      });
    }
  }

  startRecording() {
    this.isRecording = !this.isRecording;
    this.recordedBlobs = [];
    let options: any = {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      mimeType:  MediaRecorder.isTypeSupported("video/webm;codecs=h264") ?  "video/webm;codecs=h264":
       navigator.userAgent.indexOf('Safari') > -1  ? 'video/mp4;codecs=avc1' : 'video/webm',
    };


    try {
      this.mediaRecorder = new MediaRecorder(this.stream, options);
    } catch (err) {
      console.log(err);
    }

    this.mediaRecorder.start(); // collect 100ms of data

    this.onDataAvailableEvent();
    this.onStopRecordingEvent();
  }

  stopRecording() {
    this.mediaRecorder.stop();

    this.showPreview = false;
    this.isRecording = !this.isRecording;
    this.stream && this.stream.getTracks() && this.stream.getTracks().forEach(track => track.stop());
    this.isRecorded.emit(this.recordedBlobs);
    this.isRecordCompelte = true;
  }

  async submitVideo() {


    const { src }: any = document.querySelector("video.video.isVisible");
    // console.log(src);

    let blob = null;
    let file = null;
    await fetch(src).then(async res => {
      blob = await res?.blob();
      file = new File([blob], 'file', { type: 'video/x-matroska' });
      let container = new DataTransfer();
      container.items.add(file);
      this.videoRef.nativeElement.files = container.files;
      console.log({
        file,
        blob,
        value: this.videoForm.value
      });
      const formData = new FormData();
      formData.append('file', blob);
      this.dataService.uploadFile(formData).subscribe(
        (res: any) => {
          debugger;
        },
        err => {
          debugger;
        }
      )
    })



  }

  playRecording() {
    if (!this.recordedBlobs || !this.recordedBlobs.length) {
      console.log('cannot play.');
      return;
    }
    this.recordVideoElement.play();
  }

  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  onStopRecordingEvent() {
    try {
      this.mediaRecorder.onstop = (event: Event) => {
        let videoBuffer = new Blob(this.recordedBlobs, {
          type: 'video/webm',
        });

        if (navigator.userAgent.indexOf('Safari') > -1) {
          videoBuffer = new Blob(this.recordedBlobs, {
            type: 'video/mp4'
          })
        }
        this.downloadUrl = window.URL.createObjectURL(videoBuffer); // you can download with <a> tag
        this.recordVideoElement.src = this.downloadUrl;
      };
    } catch (error) {
      console.log(error);
    }
  }

  upload() {
    if (this.recordedBlobs)
      this.dataService.uploadVideo(this.recordedBlobs);
  }
}
