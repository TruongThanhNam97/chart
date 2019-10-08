import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class CompletionProgressService {
  source: AngularFireObject<any>;
  constructor(private http: HttpClient, private db: AngularFireDatabase) { }

  getData() {
    this.source = this.db.object('/source');
    return this.source.snapshotChanges();
  }

  createChartData(body) {
    return this.db.list('/source').push(body);
  }

  updateChartData(body) {
     this.source.update(body);
  }

}
