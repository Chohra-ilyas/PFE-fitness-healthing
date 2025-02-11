// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable, map } from 'rxjs';

// @Injectable()
// export class LoggerInterceptor implements NestInterceptor {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Observable<any> | Promise<Observable<any>> {
//     console.log('Before...');

//     return next.handle().pipe(
//       map((datafromRouteHandler) => {
//         const { password, ...otherData } = datafromRouteHandler;
//         return { ...otherData };
//       }),
//     );
//   }
// }
