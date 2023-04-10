export type IShowType = '1' | '2' | 'all';
export type IShowMode = 'LEN_96' | 'LEN_24';

export type ICommonStruct = {
  date: string;
  updateTime: string;
  daData: (number | null)[];
  rtData: (number | null)[];
};

export type IMenuItem = Record<'label' | 'value', string>;

export type IMenuList = (IMenuItem & { children?: IMenuList })[];

export type IData = {
  date: string;
  updateTime: string;
  daData: (number | null)[];
  rtData: (number | null)[];
  tvMeta: {
    delta: number;
    deltaUnit: number;
    size: number;
    startDateTime: string;
  };
};
