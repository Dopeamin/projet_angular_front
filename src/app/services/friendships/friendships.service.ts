import { Friendship } from '@/types/friendship.type';
import { Profile } from '@/types/profile.type';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CryptographyService } from '../cryptography/cryptography.service';
import { Endpoints } from '../http/endpoints';
import { HttpService } from '../http/http.service';
import { ProfileService } from '../profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class FriendshipsService {

  constructor(
    private httpService: HttpService,
    private profileService: ProfileService,
    private cryptographyService: CryptographyService
  ) { }

  public async getFriendships(
    type: "incoming" | "outgoing" | "all" = "all",
    status: Friendship["status"] = "accepted",
    query: string = ""
  ) {
    return firstValueFrom(
      await this.httpService.get<Friendship[]>(Endpoints.Friendships, {
        type,
        status,
        query
      })
    )
  }

  public async sendFriendRequest(id: string) {
    return firstValueFrom(
      await this.httpService.post<Friendship>(Endpoints.Friendships + id)
    )
  }

  public async acceptFriendRequest(profile: Profile) {
    const myProfile = this.profileService.getMyProfile();
    const symmetricKey = this.cryptographyService.generateSymmetricKey();
    const senderEncryptedSymmetricKey = this.cryptographyService.encryptSymmetricKey(
      profile.publicKey,
      symmetricKey
    );
    const receiverEncryptedSymmetricKey = this.cryptographyService.encryptSymmetricKey(
      myProfile.publicKey,
      symmetricKey
    );
    return firstValueFrom(
      await this.httpService.patch<Friendship>(Endpoints.AcceptFriendRequest + profile.id, {
        senderEncryptedSymmetricKey,
        receiverEncryptedSymmetricKey
      })
    )
  }

  public async declineFriendRequest(id: string) {
    return firstValueFrom(
      await this.httpService.patch<Friendship>(Endpoints.DeclineFriendRequest + id)
    )
  }
}
