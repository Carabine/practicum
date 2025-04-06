import { Injectable } from "@nestjs/common";
import { getJsDateFromExcel } from "excel-date-to-js";
import { Cell } from "read-excel-file/types";
import { FORMAT_TYPE } from "./formatter.types";

@Injectable()
export class FormatterService {
  timeFormat(d: Date): string {
    // const isNumber = typeof d === 'number'
    // if(!isNumber) {
    //     d = new Date(d.toLocaleString('en-US', {
    //         timeZone: 'Pacific/Tahiti'
    //     }))
    // }

    // if(isNumber) {
    //     d = getJsDateFromExcel(d)
    // }

    // d = new Date(Date.parse(d) - (2 * 60 * 60 * 1000) - (2 * 60 * 1000) + (12 * 1000) - (isNumber ? (20 * 1000) : (-4 * 1000)))

    let hours: any = d.getUTCHours();
    let minutes: any = d.getUTCMinutes();
    let seconds: any = d.getUTCSeconds();

    if(hours < 10) hours = '0' + hours
    if(minutes < 10) minutes = '0' + minutes
    if(seconds < 10) seconds = '0' + seconds
    return hours + ":" + minutes + ":" + seconds;
  }

  formateDate(d: Date, separator: string = '.'): string {
    // if(typeof d === 'number') {
    //     d = getJsDateFromExcel(d)
    // }
    // if(typeof d !== 'object') {
    //     return d.toString()
    // }
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return day + separator + month + separator + year;
  }

  decimalToDate(decimal: number): Date {
    let totalSeconds = Math.round(decimal * 24 * 60 * 60);
    let date = new Date(Date.UTC(1970, 0, 1, 0, 0, 0));
    date.setUTCSeconds(totalSeconds);
    return date;
  }

  formate(data: Cell, type: FORMAT_TYPE) {
    if(typeof data === "string") {
      switch(type) {
        case "DATE": {
          console.log('date')
          console.log(data)
          console.log(new Date(data))
          return this.formateDate(new Date(data))
        }
        case "UPPER_CASE": {
          return data.toUpperCase()
        }
      }
    } else if(typeof data === "number") {
      switch(type) {
        case "TIME": {
          console.log('time')
          console.log(data)
          console.log(new Date(data))
          return this.timeFormat(this.decimalToDate(data))
        }
        case "RESEARCH_NUMBER": {
          return `№ ${data}`
        }
        case "AGE": {
          return `(${data})`
        }
      }
    }
  }
}