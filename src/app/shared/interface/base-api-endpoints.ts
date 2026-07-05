import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, map} from 'rxjs';
import {BaseEntity} from './base-entity';
import {BaseResource} from './base-resource';
import {BaseResponse} from './base-response';
import {BaseAssembler} from './base-assembler';
import {toFriendlyError} from '../infrastructure/http-error';

export class BaseApiEndpoints<
  Tentity extends BaseEntity,
  Tresource extends BaseResource,
  Tresponse extends BaseResponse,
  Tassembler extends BaseAssembler<Tentity, Tresource, Tresponse>
> {
  constructor(
    protected http :  HttpClient,
    protected endpointUrl : string,
    protected assembler :Tassembler
  ) {}

  getAll(): Observable<Tentity[]>{
    return this.http.get<Tresponse | Tresource[]>(this.endpointUrl).pipe(
      map(response=>{
        console.log(response);
        if(Array.isArray(response)){
          return response.map(resource=>this.assembler.toEntityFromResource(resource))
        }
        return this.assembler.toEntitiesFromResponse(response as Tresponse)
      }),
      catchError(this.handleError('Failed to fetch entities'))
    );
  }

  getById(id: number): Observable<Tentity> {
    return this.http.get<Tresource>(`${this.endpointUrl}/${id}`).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch entity'))
    );
  }

  create(entity: Tentity): Observable<Tentity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.post<Tresource>(this.endpointUrl, resource).pipe(
      map(created => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('Failed to create entity'))
    );
  }

  update(entity: Tentity, id: number): Observable<Tentity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.put<Tresource>(`${this.endpointUrl}/${id}`, resource).pipe(
      map(updated => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update entity'))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`).pipe(
      catchError(this.handleError('Failed to delete entity'))
    );
  }

  protected handleError(operation: string){
    return (errors: HttpErrorResponse): Observable<never> => throwError(() => toFriendlyError(operation, errors));
  }
}

