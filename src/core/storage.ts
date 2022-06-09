import { StorageType } from "@src/types";
import { Deta } from "deta";
import Base from "deta/dist/types/base";
import { CompositeType } from 'deta/dist/types/types/basic';
import { FetchOptions } from 'deta/dist/types/types/base/request';
import { FetchResponse} from 'deta/dist/types/types/base/response';

const deta = Deta(process.env.DETA_PROJECT_KEY);
const db = deta.Base("gbot");

export const storage = (storageType: StorageType, guildId: string = ""):ExpansionBase => {
  if (storageType == StorageType.SETTINGS) {
    return addFetchAll(db as ExpansionBase);
  } else {
    if (guildId == "") throw Error();
    return addFetchAll(deta.Base(`gbot-words-${guildId}`) as ExpansionBase);
  }
};

export type ExpansionBase = Base & {
  fetchAll(query?: CompositeType, options?: FetchOptions) : Promise<FetchResponse>;
}

const addFetchAll = (db: ExpansionBase) : ExpansionBase => {
  db.fetchAll = async (query?, options?) => {
    let res = await db.fetch();
    let allItems = res.items;

    while (res.last) {
      res = await db.fetch(query, Object.assign(options ?? {},{ last: res.last }));
      allItems = allItems.concat(res.items);
    }
    res.items = allItems;
    return res;
  }
  return db;
};