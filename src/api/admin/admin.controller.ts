import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Render,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DocumentService } from 'src/document/document.service';
import { promises as fs } from 'fs';
import { ConfigService } from 'src/config/config.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfService } from 'src/pdf/pdf.service';
import { UtilsService } from 'src/utils/utils.service';
import { FormatterService } from 'src/utils/formatter.service';
import AdmZip from 'adm-zip';
import { MailerService } from '../../mailer/mailer.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly config: ConfigService,
    private readonly pdfService: PdfService,
    private readonly utils: UtilsService,
    private readonly documentService: DocumentService,
    private readonly formatter: FormatterService,
    private readonly mailer: MailerService,
  ) {}

  @Post('/documents/send')
  async sendDocument(@Query() query, @Res() res: Response) {
    for (const prop in query) {
      const document = await this.documentService.findOne({
        where: { id: Number(query[prop]) },
      });

      const url = `${this.config.get('URL')}login/${document.id}/${
        document.password
      }`;

      if (document.email) {
        await this.mailer.sendMail(
          document.email,
          'Dialab | Результат ПЦР-тесту',
          `Результат ПЦР-тесту можна переглянути за посиланням: ${url}`,
        );
      }
    }
    res.sendStatus(200);
  }

  @Post('/table/:lang?')
  @UseInterceptors(FileInterceptor('file'))
  async generateTable(
    @UploadedFile() file: Express.Multer.File,
    @Param('lang') lang,
  ) {
    try {
      const filename = 'filename' + Math.floor(Math.random() * 1000000);
      await fs.writeFile(`./temp/${filename}.xlsx`, file.buffer);
      const data = await this.pdfService.getPreviewData(
        filename,
        lang ? lang : 'ru',
      );
      await fs.unlink(`./temp/${filename}.xlsx`);

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/pdf/:lang?')
  @UseInterceptors(FileInterceptor('file'))
  async generatePdf(
    @UploadedFile() file: Express.Multer.File,
    @Param('lang') lang = 'ru',
  ) {
    await this.pdfService.generatePdf(file, lang);
    return 'OK';
  }

  @Get('/documents/count')
  async getDocumentsCount() {
    return await this.documentService.count();
  }

  @Get('/documents')
  async getDocuments(@Query() query) {
    throw new Error("TEST ERROR SENTRY")
    return await this.documentService.findAll({
      skip: Number(query.offset),
      take: Number(query.limit),
      order: { created: 'DESC' },
    });
  }

  @Delete('/documents')
  async deleteDocument(@Query() query) {
    for (const prop in query) {
      await this.documentService.remove({ id: Number(query[prop]) });
      await fs.unlink(`./output/${Number(query[prop])}.pdf`);
    }
    return 'OK';
  }

  @Get('/documents/download')
  async downloadDocument(@Query() query, @Res() res: Response) {
    const zip = new AdmZip();

    for (const prop in query) {
      //const document = await Document.findOne({where: {id: req.query[prop]}})
      const documentData = await fs.readFile(`./output/${query[prop]}.pdf`);
      const document = await this.documentService.findOne({
        where: { id: Number(query[prop]) },
      });

      await fs.writeFile(`./temp/zip/${document.filename}`, documentData);
      //const documentData2 = await fs.readFile(`${process.env.TEMP_PATH}pdf/${document.filename}`)
      zip.addLocalFile(`./temp/zip/${document.filename}`);
      //await fs.unlink(`./temp/zip/${document.filename}`)
    }

    const downloadName = `${Date.now()}.zip`;

    zip.getEntries().forEach((entry) => {
      entry.header.made = 0x314;
      entry.header.flags |= 0x800;
    });

    const data = zip.toBuffer();

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${downloadName}`,
      'Content-Length': data.length,
    });

    res.send(data);
  }



  @Get('/upload')
  @Render('upload')
  renderUploadPage() {
    return { url: this.config.get('URL') };
  }

  @Get('/delete')
  @Render('delete')
  renderDeletePage() {
    return { url: this.config.get('URL') };
  }
  @Get('/download')
  @Render('download')
  renderDownloadPage() {
    return { url: this.config.get('URL') };
  }
  @Get('/send')
  @Render('send')
  renderSendPage() {
    return { url: this.config.get('URL') };
  }
}
