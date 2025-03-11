import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class HttpUtilsService {
  constructor(private tokenService: TokenService) {}

  getHeaders(): HttpHeaders {
    const headers = this.tokenService.getAuthToken()
      ? new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: this.tokenService.getAuthToken(),
        })
      : new HttpHeaders();

    return headers;
  }

  getHeadersImage(): HttpHeaders {
    const headers = this.tokenService.getAuthToken()
      ? new HttpHeaders({
          Authorization: this.tokenService.getAuthToken(),
        })
      : new HttpHeaders();

    return headers;
  }
}
