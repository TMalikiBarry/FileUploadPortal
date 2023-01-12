import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatFileSize'
})
export class FormatFileSizePipe implements PipeTransform {
  oneMega = 1024 * 1024;

  transform(value: number): string {
    let convertedSize: string;
    if (value < this.oneMega) {
      convertedSize = Math.floor(value / 1024) + ' KB';
    } else {
      convertedSize = (value / this.oneMega).toFixed(2) + ' MB';
    }
    return convertedSize;
  }

}
