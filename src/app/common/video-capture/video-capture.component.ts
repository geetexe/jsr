import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
declare var MediaRecorder: any;
@Component({
  selector: 'app-video-capture',
  templateUrl: './video-capture.component.html',
  styleUrls: ['./video-capture.component.scss']
})
export class VideoCaptureComponent implements OnInit {
  @ViewChild('recordedVideo') recordVideoElementRef!: ElementRef;
  @ViewChild('video') videoElementRef!: ElementRef;
  @Input() isRetake: boolean = false;
  @Output() isRecorded: EventEmitter<Blob[]> = new EventEmitter<Blob[]>();

  videoElement!: HTMLVideoElement;
  recordVideoElement!: HTMLVideoElement;
  mediaRecorder: any;
  recordedBlobs!: Blob[];
  isRecording: boolean = false;
  downloadUrl!: string;
  stream!: MediaStream;
  showPreview: boolean = true;
  isRecordCompelte: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['isRetake'].currentValue) {
      this.showPreview = true;
      this.isRecordCompelte = false;
      this.isRecorded.emit([]);
      this.recordedBlobs = [];
      this.ngOnInit();
    }
  }

  async ngOnInit() {
    let width = document.getElementById('video-1')?.clientWidth;
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

  startRecording() {
    this.isRecording = !this.isRecording;
    
    this.recordedBlobs = [];
    let options: any = { mimeType: 'video/webm',
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
        const videoBuffer = new Blob(this.recordedBlobs, {
          type: 'video/webm',
        });
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
