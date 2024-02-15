import { Body, Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../helpers/file-helper';
import { UserDto } from './dto/user.dto';
import { TypedEventEmitter } from '../event-emitter/typed-event-emitter.class';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private readonly eventEmitter: TypedEventEmitter) { }

    @Post('/signup')
    signUp(
        @Body() authCredentialDto: AuthCredentialDto
    ): Promise<void> {
        return this.authService.signUp(authCredentialDto);
    }

    @Post('/signup-with-single-upload')
    @UseInterceptors(FileInterceptor('avatar',
        {
            storage: diskStorage({
                destination: './public/avatar',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }
    ))
    signUpWithSinleUpload(
        @Body() userDto: UserDto,
        @UploadedFile() file: Express.Multer.File
    ): any {
        console.log("file===>", file);
        //Name that can be store in database
        console.log("file===>", file.filename);
        //return this.authService.signUp(userDto);
    }

    @Post('/signup-with-multiple-upload')
    @UseInterceptors(FilesInterceptor('avatar',
        5,
        {
            storage: diskStorage({
                destination: './public/product',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }
    ))
    signUpWithMultipleUpload(
        @Body() userDto: UserDto,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): any {
        //console.log("file===>", files);
        const response = [];
        files.forEach(file => {
            const fileReponse = {
                originalname: file.originalname,
                filename: file.filename,
            };
            response.push(fileReponse);
        });
        return response;
    }

    @Post('/signin')
    signIn(@Body() userDto: UserDto): Promise<{ accessToken: string }> {
        this.eventEmitter.emit('user.signin-email', userDto);
        return this.authService.signIn(userDto);
    }

    @Get(':imgpath')
    seeUploadedFile(@Param('imgpath') image, @Res() res) {
        return res.sendFile(image, { root: './public/avatar' });
    }
}
