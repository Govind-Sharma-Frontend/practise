// // types/formidable.d.ts
// declare module 'formidable' {
//     import { IncomingMessage } from 'http';

//     interface File {
//         filepath: string;
//         originalFilename: string;
//         mimetype: string;
//         size: number;
//     }

//     interface Fields {
//         [key: string]: string | string[];
//     }

//     interface IncomingForm {
//         parse(req: IncomingMessage, callback: (err: any, fields: Fields, files: { [key: string]: File | File[] }) => void): void;
//         uploadDir: string;
//         keepExtensions: boolean;
//         maxFileSize: number;
//     }

//     function IncomingForm(): IncomingForm;

//     export = IncomingForm;
// }
