import { Profile } from '@/types/profile.type';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from '../http/endpoints';
import { HttpService } from '../http/http.service';
import { LocaleService } from '../locale/locale.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private httpService: HttpService,
    private localeService: LocaleService
  ) { }

  public getMyProfile() {
    return this.localeService.getUser().profile;
  }

  public async getProfileById(id: string) {
    return firstValueFrom(
      await this.httpService.get<Profile>(Endpoints.Profile + id)
    );
  }

  public async getProfiles(query: string = '') {
    return firstValueFrom(
      await this.httpService.get<Profile[]>(Endpoints.Profile, {
        query
      })
    );
  }
}
