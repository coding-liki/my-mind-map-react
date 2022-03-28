
export default class LocalStorage{
    static storage = window.localStorage;

    static get(key){
        return  LocalStorage.storage.getItem(key);
    }

    static set(key, value) {
        return  LocalStorage.storage.setItem(key, value);
    }

    static remove(key){
        return  LocalStorage.storage.removeItem(key);
    }

    static clear(){
        return localStorage.clear();
    }
}
