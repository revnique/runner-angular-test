import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { titles } from "../data/titles";

@Injectable()
export class SuggestionService {
    constructor(private http: HttpClient) { }
    public getSuggestions(): Observable<any> {
        return of(titles);
    }
}