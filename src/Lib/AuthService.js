import {api} from "../Api/Auth/Api";

export default class AuthService{
    check(){
        let authApi = api;

        api.check().then((result) => {
            console.log("success", result)
        }).catch((error) => {
            console.log("error", error)
        });
    }

}