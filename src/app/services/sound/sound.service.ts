import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { }

  private playSound(src: string) {
    const audio = new Audio();
    audio.src = src;
    audio.load();
    audio.play();
  }

  playNotificationSound() {
    this.playSound("assets/sounds/notification.wav");
  }

  playMessageSound() {
    this.playSound("assets/sounds/message.mp3");
  }
  
}
