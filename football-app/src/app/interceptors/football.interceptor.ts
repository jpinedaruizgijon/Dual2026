import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const footballInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(environment.footballApiUrl)) {
    const reqConToken = req.clone({
      setHeaders: { 'X-Auth-Token': environment.footballApiKey }
    });
    return next(reqConToken);
  }
  return next(req);
};
