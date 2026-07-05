import {BaseResource} from '../../shared/interface/base-resource';

export interface PreferencesResource {
  language: string;
  theme: string;
  notificationsEnabled: boolean;
}

export interface ProfileResource extends BaseResource {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImageUrl: string;
  preferences: PreferencesResource;
}

/** Request body for PUT /profiles/{profileId}. */
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImageUrl: string;
}

/** Request body for PUT /profiles/{profileId}/preferences. */
export interface UpdatePreferencesRequest {
  language: string;
  theme: string;
  notificationsEnabled: boolean;
}
