export interface fn1<Param,Return> {
    (param: Param): Return;
}
export type fnObjectVoid = fn1<object, void>;
