import { StorageType } from "@src/types/index.ts";
import { Deta } from "deta";
import Base from "https://esm.sh/v130/*deta@1.2.0/dist/types/base/index.d.ts";
import { FetchOptions } from "deta/dist/types/types/base/request";
import { FetchResponse } from "deta/dist/types/types/base/response";
import { CompositeType } from "deta/dist/types/types/basic";
export type { FetchResponse };

const deta = Deta(Deno.env.get("DETA_PROJECT_KEY"));
const db = deta.Base("gbot");

export const storage = (
  storageType: StorageType,
  guildId = "",
): ExtensionBase => {
  if (storageType == StorageType.SETTINGS) {
    return addFetchAll(db as unknown as ExtensionBase);
  } else {
    if (guildId == "") throw Error();
    return addFetchAll(deta.Base(`gbot-words-${guildId}`) as unknown as ExtensionBase);
  }
};

export type ExtensionBase = Base & {
  fetchAll(
    query?: CompositeType,
    options?: FetchOptions,
  ): Promise<FetchResponse>;
};

const addFetchAll = (db: ExtensionBase): ExtensionBase => {
  db.fetchAll = async (query?, options?) => {
    let res = await db.fetch();
    let allItems = res.items;

    while (res.last) {
      res = await db.fetch(
        query,
        Object.assign(options ?? {}, { last: res.last }),
      );
      allItems = allItems.concat(res.items);
    }
    res.items = allItems;
    return res;
  };
  return db;
};
