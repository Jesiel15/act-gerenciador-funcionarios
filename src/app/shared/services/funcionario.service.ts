import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FuncionarioModel } from '../models/funcionario.model';
import { HttpUtilsService } from '../utils/http-utils.service';
import { ProfileEnum } from '../enums/profile.enum';
import { ResponseModel } from '../models/reponse.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(
    private http: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  getFuncionarios(
    profile?: ProfileEnum
  ): Observable<ResponseModel<FuncionarioModel[]>> {
    const headers = this.httpUtilsService.getHeaders();
    const urlFuncionarioList = profile
      ? `${this.apiUrl}-list/${profile}`
      : `${this.apiUrl}-list/`;
    return this.http.get<ResponseModel<FuncionarioModel[]>>(
      urlFuncionarioList,
      { headers }
    );
  }

  getFuncionarioById(
    id: string
  ): Observable<ResponseModel<FuncionarioModel> | undefined> {
    const headers = this.httpUtilsService.getHeaders();
    return this.http.get<ResponseModel<FuncionarioModel>>(
      `${this.apiUrl}/${id}`,
      {
        headers,
      }
    );
  }

  createFuncionario(
    funcionario: FuncionarioModel
  ): Observable<ResponseModel<FuncionarioModel>> {
    const headers = this.httpUtilsService.getHeaders();
    return this.http.post<ResponseModel<FuncionarioModel>>(
      this.apiUrl,
      funcionario,
      { headers }
    );
  }

  updateFuncionario(
    funcionario: FuncionarioModel
  ): Observable<ResponseModel<FuncionarioModel>> {
    const headers = this.httpUtilsService.getHeaders();
    return this.http.put<ResponseModel<FuncionarioModel>>(
      `${this.apiUrl}/${funcionario.id}`,
      funcionario,
      { headers }
    );
  }

  changePassword(
    id: string,
    new_password: string
  ): Observable<ResponseModel<FuncionarioModel>> {
    const headers = this.httpUtilsService.getHeaders();
    return this.http.put<ResponseModel<FuncionarioModel>>(
      `${this.apiUrl}/change-password/${id}`,
      { new_password },
      { headers }
    );
  }

  deleteFuncionario(id: string): Observable<ResponseModel<FuncionarioModel>> {
    const headers = this.httpUtilsService.getHeaders();
    return this.http.delete<ResponseModel<FuncionarioModel>>(
      `${this.apiUrl}/${id}`,
      {
        headers,
      }
    );
  }
}
