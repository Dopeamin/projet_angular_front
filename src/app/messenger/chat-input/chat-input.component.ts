import { ChatService } from '@/app/services/chat/chat.service';
import { SendMessageDto } from '@/app/services/chat/send-message.dto';
import { CryptographyService } from '@/app/services/cryptography/cryptography.service';
import { LocaleService } from '@/app/services/locale/locale.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { bindCallback, map, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'chat-input',
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent implements OnInit {
  id = "";
  message = "";
  files: (File & { src: string })[] = [];
  MAX_FILES = 24;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  onPaste(e: ClipboardEvent) {
    const clipboardData = e.clipboardData || (window as any).clipboardData;
    const items: DataTransferItem[] = Array.from(clipboardData.items);
    const images = items.filter(x => /image/i.test(x.type));
    if (images.length) {
      images.forEach((image) => {
        const file = image.getAsFile() as File & { src: string };
        file.src = URL.createObjectURL(file);
        this.files.push(file);
      });
    }
  }

  sendMessage() {
    if (this.message === "" && !this.files.length) return;
    const dto: SendMessageDto = {
      groupChatId: this.id,
      text: this.message,
      files: this.files,
    };
    if (!this.message)
      delete dto.text;
    this.chatService.sendMessage(dto);
    this.message = "";
    this.files = [];
  }

  addFiles(event: any) {
    if (event.target.files.length > this.MAX_FILES) {
      alert(`You can only upload ${this.MAX_FILES} files at a time.`);
    }
    this.files = [...event.target.files].slice(0, this.MAX_FILES);
    this.files.map(file => {
      file.src = URL.createObjectURL(file);
    });
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }
}
