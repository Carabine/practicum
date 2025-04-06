import { Injectable } from "@nestjs/common";
import readXlsxFile from "read-excel-file/node";
import { FormatterService } from "src/utils/formatter.service";
import * as jsonData from './data.json'
import {promises as fs} from 'fs'
import { PDFDocument, rgb } from "pdf-lib";
import * as fontkit from '@pdf-lib/fontkit'
import { UtilsService } from "src/utils/utils.service";
import { v4 as uuid } from 'uuid';
import * as QRCode from 'qrcode'
import { DocumentService } from "src/document/document.service";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class PdfService {
  private regularFontBytes
  private boldFontBytes
  private bolderFontBytes

  constructor(
    private readonly formatter: FormatterService,
    private readonly utils: UtilsService,
    private readonly documentService: DocumentService,
    private readonly config: ConfigService
  ) {
    this.loadFonts()
  }

  async getPreviewData(filename: string, lang: string) {
    const rows = await readXlsxFile(`./temp/${filename}.xlsx`)
    const data = []

    console.log(rows)

    for(let i = 1; i < rows.length; i++) {
        const row = rows[i]
        const data2 = []

        for(let i2 = 0; i2 < row.length; i2++) {
            if(jsonData.text[lang][i2]) {
                if(row[i2]) {
                  if(i === 1) {
                    data2.push(row[i2].toString())
                  } else {
                    console.log(row[i2], jsonData.text[lang][i2].formatType, typeof row[i2])
                    data2.push(jsonData.text[lang][i2].formatType ? this.formatter.formate(row[i2], jsonData.text[lang][i2].formatType) : row[i2].toString())                                                             
                  }
                } else {
                  data2.push(null)
                }
            } else {
              data2.push(null)
            }
        }
        data.push(data2)
    }
    return data
  }

  async generatePdf(file: Express.Multer.File, lang: string): Promise<void> {
    try {
      const filename = file.originalname.substring(0, file.originalname.lastIndexOf('.')) + Math.floor(Math.random() * 1000000)
      await fs.writeFile(`./temp/${filename}.xlsx`, file.buffer) 

      const pdfData = await fs.readFile(`./templates/${lang}.pdf`);
      const regularFontBytes = await fs.readFile(`./fonts/regular.ttf`)
      const boldFontBytes = await fs.readFile(`./fonts/bold.ttf`)
      const bolderFontBytes = await fs.readFile(`./fonts/bolder.ttf`);

      const rows = await readXlsxFile(`./temp/${filename}.xlsx`)

      for(let i = 2; i < rows.length; i++) {
          const row = rows[i]

          const pdfDoc = await PDFDocument.load(pdfData)
          pdfDoc.registerFontkit(fontkit)

          const regularFont = await pdfDoc.embedFont(regularFontBytes)
          const boldFont = await pdfDoc.embedFont(boldFontBytes)
          const bolderFont = await pdfDoc.embedFont(bolderFontBytes)

          const fonts = {regular: regularFont, bold: boldFont, bolder: bolderFont}
          
          const pages = pdfDoc.getPages()
          const firstPage = pages[0]

          const dbData = {};

          const {text, linkedText} = jsonData

          for(let i = 0; i < row.length; i++) {
              if(text[lang][i]) {
                  if(row[i]) {     
                          const formattedText = text[lang][i].formatType ? this.formatter.formate(row[i], text[lang][i].formatType) : row[i].toString();
                          if(!text[lang][i].dontPrint) {
                              firstPage.drawText(formattedText, {
                                  x: text[lang][i].x,
                                  y: text[lang][i].y,
                                  size: text[lang][i].size,
                                  font: fonts[text[lang][i].font],
                                  color: text[lang][i].color ? text[lang][i].color : rgb(0,0,0)
                              })
                          }
                          console.log(text[lang][i].columnName + "=" + formattedText)
                          dbData[text[lang][i].columnName] = formattedText
                  } else {
                      console.log(`Не вывел значение у колонки ${text[lang][i].name}, потому что пустая ячейка`)
                  }
              }
              
          }

          for(const link of linkedText[lang]) {
              const i = link.linkTo
              if(row[i]) {   
                  const filteredText = link.filter ? link.filter(row[i]) : row[i].toString();
                  firstPage.drawText(filteredText, {
                      x: link.x,
                      y: link.y,
                      size: link.size,
                      font: fonts[link.font],
                      color: link.color ? link.color : rgb(0,0,0)
                  })  
              } else {
                  console.log(`Не вывел значение у колонки ${text[lang][i].name}, потому что пустая ячейка`)
              }
          }

          const pdfId = this.utils.getRandomNumbers(8)
          const password = this.utils.getRandomNumbers(6)

          const url = `${this.config.get("URL")}login/${pdfId}/${password}`

          const qrImagePath = `${this.config.get("TEMP_PATH")}${uuid()}.png`
          await QRCode.toFile(qrImagePath, url, {margin: 0, width: 55})
          const qrBytes = await fs.readFile(qrImagePath)

          const jpgImage = await pdfDoc.embedPng(qrBytes)

          firstPage.drawImage(jpgImage, {
              x: firstPage.getWidth() - jpgImage.width - 13,
              y: firstPage.getHeight() - jpgImage.height - 13,
              width: jpgImage.width,
              height: jpgImage.height,
          })
              
          fs.unlink(qrImagePath)

          const pdfBytes = await pdfDoc.save()
          const pdfFilename = `${this.utils.getNameWithInitials(rows[i][0].toString().toUpperCase())} - ${text[lang][7]?.formatType ? this.formatter.formate(row[7], text[lang][7]?.formatType) : row[7].toString()} - ${rows[i][3]} (${row[5]} - ПЦР исследование на SARS-CoV-2 (COVID-19) (Ж019)).pdf`;
          console.log({id: Number(pdfId), ...dbData, password, created: new Date(), filename: pdfFilename})
          const document = await this.documentService.create({id: Number(pdfId), ...dbData, password, created: new Date(), filename: pdfFilename})

          await fs.writeFile(`./output/${document?.id}.pdf`, pdfBytes)

          if(!document) {
              console.log('Ошибка при сохранении записи под номером ' + (i + 1))
          }  
      }
      console.log('Загружено')
      fs.unlink(`./temp/${filename}.xlsx`)

    } catch(err) {
        console.log('Произошла ошибка')
        console.log(err)
    }
  }

  private async loadFonts() {
    this.regularFontBytes = await fs.readFile(`./fonts/regular.ttf`)
    this.boldFontBytes = await fs.readFile(`./fonts/bold.ttf`)
    this.bolderFontBytes = await fs.readFile(`./fonts/bolder.ttf`);
  }
}