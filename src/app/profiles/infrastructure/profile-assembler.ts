import {ProfileEntity} from '../domain/model/profile-entity';
import {ProfileResource} from './profile-resources';

export class ProfileAssembler {

  static toEntity(resource: ProfileResource): ProfileEntity {
    return new ProfileEntity({
      id: resource.id,
      userId: resource.userId,
      firstName: resource.firstName,
      lastName: resource.lastName,
      phoneNumber: resource.phoneNumber,
      profileImageUrl: resource.profileImageUrl,
      preferences: resource.preferences,
    });
  }
}
