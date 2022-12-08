import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

// API url

  id: number = JSON.parse(localStorage.getItem('user') || '{}').id || 0;
  baseApiUrl = `http://127.0.0.1:8000/api/user/${this.id}?_method=PUT`;

  constructor(private http: HttpClient) {
  }

// Returns an observable
  upload(file: File): Observable<any> {

    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    console.log("file", file)
    console.log("file.name", file.name)
    formData.append("file", file, file.name);
    formData.append("type", "profilePicture");

    // Make http post request over api
    // with formData as req
    return this.http.post(this.baseApiUrl, formData)
  }
}
