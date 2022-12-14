import {getUuidv4, hydrate} from '../utils/stores';
import {action, observable} from 'mobx';
import { SmsParams, User, ValidCodeParams } from "../api/types";
import { authorization, registration, sendSms, validCode } from "../api/api";
import {logError} from '../utils/handlers';
import {persist} from 'mobx-persist';
import { Alert } from "react-native";
import { showAlertError } from "../utils/utils";

const initUser = {
  sessionId: '08d6d9d8-4af8-11ed-850b-0050569df549',
  name: '',
  phone: '',
  birthday: (new Date()).getTime(),
  gender: '',
};

export interface IAuthStore {
  user: User;
  loading: boolean;
  updateUser: (
    value: string | number,
    field: 'name' | 'phone' | 'birthday' | 'gender',
  ) => void;
  registration: (callback: () => void) => Promise<void>;
  auth: (callback: () => void) => Promise<void>;
  validCode: (code: number, callback: () => void) => Promise<void>;
}

class AuthStore implements IAuthStore {
  @persist('object') @observable user: User = initUser;
  @observable loading: boolean = false;

  //  sessionId: string;
  //   name: string;
  //   number: number;
  //   birthday: number;
  //   gender: string;
  @action.bound
  public updateUser(
    value: string | number,
    field: 'name' | 'phone' | 'birthday' | 'gender',
  ) {
    if (field === 'name' && value.toString().length < 30) {
      this.user[field] = value;
    } else if (field === 'phone' && value.toString().length <= 10) {
      if (/^[0-9]*$/.test(value)) {
        this.user[field] = Number(value);
      }
    } else if (field === 'birthday') {
      this.user[field] = value;
    }
  }

  @action.bound
  async registration(callback: () => void) {
    try {
      this.loading = true;
      // this.user.sessionId = getUuidv4();
      this.user.gender = 'men';
      logError('registration0', this.user);
      const response = await registration(this.user);
      if (response?.data?.success) {
        logError('registration response1', response.data);
        callback && callback();
      } else {
        showAlertError(response?.data?.message);
      }
      logError('registration response', response);
    } catch (e) {
      showAlertError(e?.message);
      logError('registration', e);
    } finally {
      this.loading = false;
    }
  }

  @action.bound
  async auth(callback: () => void) {
    try {
      this.loading = true;

      const params: SmsParams = {
        sessionId: this.user.sessionId,
        phone: this.user.phone.toString(),
        //getSession: '1',
      };

      logError('auth0', params);

      //const response = await authorization(params);
      const response = await sendSms(params);
      if (response?.data?.success) {
        logError('auth response1', response.data);
        callback && callback();
      } else {
        showAlertError(response?.data?.message);
      }
      logError('auth response', response);
    } catch (e) {
      showAlertError(e?.message);
      logError('auth', e);
    } finally {
      this.loading = false;
    }
  }

  @action.bound
  async validCode(code: number, callback: () => void) {
    try {
      this.loading = true;
      let params = {
        sessionId: this.user.sessionId,
        code: code,
        type: 3,
      };
      logError('validCode', params);
      const response = await validCode(params);
      if (response?.data?.success) {
        callback && callback();
        logError('validCode response', response.data);
      } else {
        showAlertError(response?.data?.message);
      }
      logError('validCode response', response);
    } catch (e) {
      showAlertError(e?.message);
      logError('validCode', e);
    } finally {
      this.loading = false;
    }
  }
}

const authStore = new AuthStore();

hydrate('authStore', authStore);

export default authStore;
