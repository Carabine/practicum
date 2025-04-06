import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsService {
  getRandomElFromArr = (arr: any[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  getRandomNumbers = (length: number): string => {
    let string = '';
    for(let i = 0; i < length; i++) {
        string += Math.floor(Math.random() * 10)
    }
    return string
  }

  getNameWithInitials = (name: string): string => {
    const nameArr = name.split(' ')
    for(let i = 0; i < nameArr.length; i++) {
        nameArr[i] = nameArr[i].charAt(0).toUpperCase() + nameArr[i].slice(1).toLowerCase()
    }

    return nameArr.join(' ')
  }
}