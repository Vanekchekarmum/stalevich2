import { hydrate } from "../utils/stores";
import { action, observable } from "mobx";
import { persist } from "mobx-persist";

import {
  addToCart,
  auditOrder,
  createSession,
  getListCity as getCities,
  getListProducts,
  getListShop as getShops,
  getShop as getShopDetails,
  orderDateTimeApi,
  periodTimeApi,
  placeOrder,
  searchProducts,
  streetName,
  transferAddress as addressTransfer,
  viewCart as fetchCart,
  userCheckApi,
  clearCart,
  payForOrder,
  addTable,
} from "../api/api";
import { getNumberValue, logError } from "../utils/handlers";
import {
  CartData,
  City,
  GetShopsParams,
  Product,
  Session,
  Shop,
} from "../api/types";
import { showAlertError } from "../utils/utils";

export interface IDataStore {
  cities: object;
  currentCity: object | null;
  loading: boolean;
  cart: CartData;
  loadPersist: boolean;
  cartUpating: boolean;
  cartUpated: boolean;
  favoriteShops: string[];
  getListCity: () => Promise<void>;
  setCurrentCity: (city: City) => void;
  setCurrentShop: (shop: Shop) => void;
  setCurrentProduct: (product: Product) => void;
  shops: Shop[];
  sortedShops: Shop[];
  shop: Shop;
  products: Product[];
  sortedProducts: Product[];
  product: Product;
  getListShop: (name: string) => Promise<void>;
  getShop: (uuidShop: string) => Promise<void>;
  getListProducts: (uuid?: string) => Promise<void>;
  searchProducts: (searchValue: string, uuid?: string) => Promise<void>;
  getProduct: (uuidProduct: string) => Promise<void>;
  onSortedProducts: (type: "name" | "price" | "rating") => void;
  onSortedShops: (type: "name" | "price" | "rating") => void;
  updateFavoriteShops: (shop: Shop) => void;
  generateSession: () => void;
  getOrganizationId: () => string;
  pushToCart: (productId: string, productCount: number) => void;
  viewCart: () => void;
  getStreetName: (name: string) => Promise<void>;
  transferAddress: (
    streetGuid: string,
    houseNumber: string,
    pickup: number
  ) => Promise<any>;
  orderDone: (data: any) => Promise<void>;
  orderAudit: (data: any) => Promise<void>;
  periodTime: (date: any, organizationId: string) => Promise<void>;
  orderDateTime: (deliveryDate: string, deliveryTime: string) => Promise<void>;
  setType: (type: any) => void;
  userCheck: (phone: string, name: string, birthday: string) => Promise<void>;
  setTable: (id: string) => void;
  setHouseNumber: (id: string) => void;
  setStreetId: (id: string) => void;
  setOrganizationId: (id: string) => void;
  placeTableOrder: () => Promise<void>;
  clearCart: () => void;
  setCart: (cart: CartData) => void;
  removeCart: () => void;
  setCountP: (count: number) => void;
  sbpPay:(  orderId: string,
    paymentGateway: string,
    orderNumber: string,
    orderSum: any) => Promise<void>;
    getLol: () => void;
}

class DataStore implements IDataStore {
  @observable cities: City[] = [];
  @observable type: string = null;
  @persist("object") @observable currentCity: City | null = null;
  @persist("object") @observable favoriteShops: string[] = [];
  @observable loading: boolean = false;
  @observable loadPersist: boolean = false;
  @observable shops: Shop[] = [];
  @observable sortedShops: Shop[] = [];
  @observable shop: Shop = {};
  @observable products: Product[] = [];
  @observable sortedProducts: Product[] = [];
  @observable product: Product = {};
  @persist("object") @observable session: Session = {};
  @observable cart: CartData | null = null;
  @observable cartUpated: boolean = false;
  @observable cartUpating: boolean = false;
  @observable table: string = null;
  @observable streetGuid: string = null;
  @observable houseNumber: string = null;
  @observable organizationId: string = null;
  @observable countP: number = 0;

  @action.bound
  public setType(type: string): void {
    this.type = type;
  }

  @action.bound
  public setCurrentCity(city: City): void {
    logError("setCurrentCity", city);
    this.currentCity = city;
  }
  @action.bound
  public clearCart(): void {
    this.cart = null;
  }

  @action.bound
  public setCurrentShop(shop: Shop): void {
    logError("setCurrentShop", shop);
    this.shop = shop;
  }

  @action.bound
  public setCurrentProduct(product: Product): void {
    logError("setCurrentProduct", product);
    this.product = product;
  }

  @action.bound
  public updateFavoriteShops(shop: Shop): void {
    logError("updateFavoriteShop", shop);
    const newFavoriteShops = new Set(this.favoriteShops);
    if (newFavoriteShops.has(shop.uuid)) {
      newFavoriteShops.delete(shop.uuid);
    } else {
      newFavoriteShops.add(shop.uuid);
    }
    this.favoriteShops = [...newFavoriteShops];
  }

  @action.bound
  public async getListShop(name: string = ""): Promise<void> {
    try {
      this.loading = true;
      let params: GetShopsParams = {
        limit: 1000,
        random: 1,
        cityUuid: this.currentCity?.uuid,
        name: name,
      };
      const response = await getShops(params);
      if (response && response?.data && response?.data?.data) {
        this.shops = response.data.data;
        this.sortedShops =
          name.length === 0
            ? response.data.data
            : response.data.data.reduce((arr, value) => {
                if (value.name.toLowerCase().includes(name.toLowerCase())) {
                  arr.push(value);
                }
                return arr;
              }, []);
      }
    } catch (e) {
      logError("getListShop", e);
    } finally {
      this.loading = false;
    }
  }

  @action.bound
  public async getShop(uuidShop: string): Promise<void> {
    console.log("its starts");
    try {
      this.loading = true;
      const response = await getShopDetails(uuidShop);
      if (response && response?.data && response?.data?.data) {
        console.log("getShop", response.data.data);
        this.shop = response.data.data;
      }
    } catch (e) {
      logError("getShop", e);
    } finally {
      this.loading = false;
    }
  }

  @action.bound
  public async getListProducts(uuid?: string): Promise<void> {
    try {
      this.loading = true;
      const response = await getListProducts(uuid || this.shop?.uuid);
      if (response && response?.data && response?.data?.data) {
        logError("getListProducts", uuid, response?.data?.data);
        this.products = response.data.data;
        this.sortedProducts = response.data.data;
      }
    } catch (e) {
      logError("getListProducts", e);
    } finally {
      this.loading = false;
    }
  }
  @action.bound
  public getOrganizationId(): string {
    return this.organizationId;
  }

  @action.bound
  public async searchProducts(
    searchValue: string,
    uuid?: string
  ): Promise<void> {
    try {
      this.loading = true;
      const response = await searchProducts(
        !uuid ? this.shop?.uuid : uuid,
        searchValue
      );
      if (response && response?.data && response?.data?.data) {
        logError("searchProducts", response?.data?.data);
        this.products = response.data.data;
        this.sortedProducts = response.data.data;
      }
    } catch (e) {
      logError("searchProducts", e);
    } finally {
      this.loading = false;
    }
  }

  @action.bound
  public onSortedProducts(type: "name" | "price" | "rating" | "all"): void {
    if (type === "name") {
      this.sortedProducts = this.products.sort((pr1: Product, pr2: Product) => {
        const namePr1 = pr1.name.toLowerCase();
        const namePr2 = pr2.name.toLowerCase();
        return namePr1 > namePr2 ? 1 : -1;
      });
    }

    if (type === "price") {
      this.sortedProducts = this.products.sort((pr1: Product, pr2: Product) => {
        return getNumberValue(pr1.price) - getNumberValue(pr2.price);
      });
    }

    if (type === "rating") {
      this.sortedProducts = this.products.sort((pr1: Product, pr2: Product) => {
        return getNumberValue(pr2.price) - getNumberValue(pr1.price);
      });
    }

    if (type === "all") {
      this.sortedProducts = this.products;
    }
  }

  @action.bound
  public onSortedShops(type: "name" | "price" | "rating" | "all"): void {
    if (type === "name") {
      this.sortedShops = this.shops.sort((pr1: Shop, pr2: Shop) => {
        const namePr1 = pr1?.name
          ? pr1?.name.toLowerCase()
          : pr1?.transliteration.toLowerCase();
        const namePr2 = pr2?.name
          ? pr2?.name.toLowerCase()
          : pr2?.transliteration.toLowerCase();
        return namePr1 > namePr2 ? 1 : -1;
      });
    }

    if (type === "price") {
      this.sortedShops = this.shops;
    }

    if (type === "rating") {
      this.sortedShops = this.shops;
    }

    if (type === "all") {
      this.sortedShops = this.shops;
    }
  }

  @action.bound
  public async getProduct(uuidProduct: string): Promise<void> {
    try {
      this.loading = true;
      const response = await getProduct(uuidProduct);
      if (response && response?.data && response?.data?.data) {
        this.products = response.data.data;
      }
    } catch (e) {
      logError("getProduct", e);
    } finally {
      this.loading = false;
    }
  }
  @action.bound
  public setCart(cart: CartData): void {
    this.cart = cart;
  }

  @action.bound
  public async getListCity(): Promise<void> {
    try {
      this.loading = true;
      const response = await getCities();

      if (response && response?.data && response?.data?.data) {
        this.cities = response.data.data;
      }
    } catch (e) {
      logError("getListCity", e);
      showAlertError(e?.message);
    } finally {
      this.loading = false;
    }
  }

  @action.bound
  public async generateSession(): Promise<void> {
    createSession()
      .then((response) => {
        this.session = response.data;
      })
      .catch((e) => {
        logError("generateSession", e);
      });
  }

  @action.bound
  public pushToCart(productId: string, productCount: number): void {
    this.cartUpated = false;
    this.cartUpating = true;
    console.log("this.session.sessionId", this.session.sessionId);
    addToCart(this.session.sessionId, this.shop.uuid, productId, productCount)
      .then((response) => {
        this.cartUpated = true;
        this.cartUpating = false;
      })
      .finally(() => {
        this.cartUpating = false;
      });
  }

  @action.bound
  public removeCart(): void {
    clearCart(this.session.sessionId, [this.shop?.uuid]);
    console.log("this.session.sessionId", this.session.sessionId);
    console.log("this.currentCity?.uuid", this.shop?.uuid);
  }

  @action.bound
  public viewCart(): void {
    fetchCart(this.session.sessionId, this.currentCity?.uuid).then(
      (response) => {
        this.cart = response.data.data;
      }
    );
  }
  @action.bound
  public getStreetName(name: string): Promise<any> {
    console.log("this.currentCity?.uuid", this.currentCity?.uuid);

    return streetName(this.currentCity?.uuid, name);
  }

  @action.bound
  public transferAddress(
    streetGuid: number,
    houseNumber: string,
    pickup: number
  ): Promise<any> {
    console.log("pickup", "-0-00--0-", pickup);

    return addressTransfer(
      this.session.sessionId,
      this.currentCity.uuid,
      streetGuid || this.streetGuid,
      houseNumber || this.houseNumber,
      pickup,
      this.shop,
      this.organizationId
    );
  }

  @action.bound
  public orderDone(data: any): Promise<any> {
    return placeOrder(this.session.sessionId, this.currentCity.uuid, data);
  }
  @action.bound
  public sbpPay = (
    orderId: string,
    paymentGateway: string,
    orderNumber: string,
    orderSum: any
  ): Promise<any> => {
    return payForOrder(orderId, paymentGateway, orderNumber, orderSum);
  };

  @action.bound
  public getLol = () => {
    return this.shop?.paymentGateway;
  };

  @action.bound
  public setCountP = (count: number): void => {
    this.countP = count;
  };
  @action.bound
  public getCountP = (): number => {
    return this.countP;
  };

  @action.bound
  public orderAudit(data: any): Promise<any> {
    return auditOrder(this.session.sessionId, this.currentCity.uuid, data);
  }

  @action.bound
  public periodTime(date: any, organizationId: string): Promise<any> {
    return periodTimeApi(
      this.session.sessionId,
      this.currentCity.uuid,
      organizationId,
      date.valueOf()
    );
  }

  @action.bound
  public orderDateTime(
    deliveryDate: string,
    deliveryTime: string
  ): Promise<any> {
    return orderDateTimeApi(
      this.session.sessionId,
      this.currentCity.uuid,
      this.shop.uuid,
      deliveryDate,
      deliveryTime
    );
  }

  @action.bound
  public userCheck(
    phone: string,
    name: string,
    birthday: string
  ): Promise<any> {
    return userCheckApi(this.session.sessionId, phone, name, birthday);
  }

  @action.bound
  public setTable(id: string) {
    this.table = id;
  }
  @action.bound
  public setHouseNumber(id: string) {
    this.houseNumber = id;
  }
  @action.bound
  public setStreetId(id: string) {
    this.streetGuid = id;
  }
  @action.bound
  public setOrganizationId(id: string) {
    console.log("id", id);
    this.organizationId = id;
  }

  @action.bound
  public placeTableOrder(): Promise<any> {
    return addTable(this.session.sessionId, this.shop.uuid, this.table);
  }
}

const dataStore = new DataStore();

hydrate("dataStore", dataStore).then(() => {
  dataStore.loadPersist = true;
});

export default dataStore;
