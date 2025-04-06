import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { DocumentService } from 'src/document/document.service';
import { promises as fs } from 'fs';
import { Response } from 'express';
import contentDisposition from 'content-disposition';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly config: ConfigService,
    private readonly documentService: DocumentService,
  ) {}

  @Get('/download/:login/:password')
  async getDocument(
    @Param('login') login,
    @Param('password') password,
    @Res() res: Response,
  ) {
    try {
      const document = await this.documentService.findOne({
        where: { id: Number(login) },
      });

      if (!document || password !== document.password) {
        throw new Error('wrong login or password');
      }
      const tempDocumentData = await fs.readFile(`./output/${document.id}.pdf`);

      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${contentDisposition(
          document.filename,
        )}`,
        'Content-Length': tempDocumentData.length.toString(),
      });
      res.send(tempDocumentData);
    } catch (err) {
      console.log(err);
      throw new Error('wrong login or password');
    }
  }

  @Get('/')
  @Render('profile')
  renderLoginPage() {
    return { url: this.config.get('URL') };
  }
}
