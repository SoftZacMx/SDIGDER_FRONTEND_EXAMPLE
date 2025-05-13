import { Component, ViewChild , ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-generate-qr-code',
  templateUrl: './generate-qr-code.component.html',
  styleUrls: ['./generate-qr-code.component.css']
})
export class GenerateQrCodeComponent {

  URL = environment.MENU_URL
  qrData = this.URL;
  @ViewChild('qrcode', { static: false }) qrcode!: ElementRef;
  
  downloadQR() {
    const qrCodeElement = document.querySelector('qrcode canvas') as HTMLCanvasElement;
    if (qrCodeElement) {
      const url = qrCodeElement.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      a.click();
    }
  }

}
