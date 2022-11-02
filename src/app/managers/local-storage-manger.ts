export class LocalStorageManger {
    static setToken(val: string){
        this.save(LocalStorageKey.token, val)
    }

    static getToken(){
        return this.load(LocalStorageKey.token)
    }

    static save(key: LocalStorageKey, val: string){
        localStorage.setItem(key, val);
    }

    static load(key: LocalStorageKey, valDefault: string = ""){
        let value = localStorage.getItem(key)
        if(value != "" && value != null && value != undefined){
            return value
        }
        return valDefault
    }
}

export enum LocalStorageKey{
    token = "accessToken"
}
