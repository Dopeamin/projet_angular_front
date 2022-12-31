import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elapsedTime'
})
export class ElapsedTimePipe implements PipeTransform {

  transform(date: Date | string, type: 'long' | 'short' = 'short'): string {
    date = new Date(date);
    const seconds = Math.floor((+new Date() - +date) / 1000);

    if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
      return 'Just now';
    const intervals = type === 'short' ? {
      'y': 31536000,
      'mo': 2592000,
      'w': 604800,
      'd': 86400,
      'h': 3600,
      'm': 60,
      's': 1
    } : {
      'year': 31536000,
      'month': 2592000,
      'week': 604800,
      'day': 86400,
      'hour': 3600,
      'minute': 60,
      'second': 1
    };
    let counter: number;
    for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      if (counter > 0)
        if (counter === 1) {
          return type === 'long' ? counter + ' ' + i + ' ago' : counter + i; // singular (1 day ago)
        } else {
          return type === 'long' ? counter + ' ' + i + 's ago' : counter + i; // plural (2 days ago)
        }
    }
    return '';
  }

}
