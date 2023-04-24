import { StorageType } from "@src/types/index.js";
import { Deta } from "deta";
import Base from "deta/dist/types/base";
import { CompositeType } from 'deta/dist/types/types/basic';
import { FetchOptions } from 'deta/dist/types/types/base/request';
import { FetchResponse} from 'deta/dist/types/types/base/response';

const deta = Deta(process.env.DETA_PROJECT_KEY);
const db = deta.Base("gbot");

export const storage = (storageType: StorageType, guildId = ""):ExtensionBase => {
  if (storageType == StorageType.SETTINGS) {
    return addFetchAll(db as ExtensionBase);
  } else {
    if (guildId == "") throw Error();
    return addFetchAll(deta.Base(`gbot-words-${guildId}`) as ExtensionBase);
  }
};

export type ExtensionBase = Base & {
  fetchAll(query?: CompositeType, options?: FetchOptions) : Promise<FetchResponse>;
}

const addFetchAll = (db: ExtensionBase) : ExtensionBase => {
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