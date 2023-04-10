export { createEvaModelCore as createModel } from 'umi';

export interface IModel<S = any, R = any, E = any, P = any> {
  namespace?: string;
  state: S;
  reducers?: R;
  effects?: E;
  subscriptions?: P;
}
