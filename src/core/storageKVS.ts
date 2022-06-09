import { join } from "node:path";
import { kvsEnvStorage } from "@kvs/env";
import rootPath from "app-root-path";
import { KVS, StorageSchema } from "@kvs/types";
import { StorageType } from "@src/types";

const storageCaches : {[key:string]:KVS<StorageSchema>} = {}

export const storage = async (storageType:StorageType,guildId: string) => {
  if(storageCaches[guildId] === undefined){
    storageCaches[guildId] = await kvsEnvStorage({
      storeFilePath: join(rootPath.path, "storage",guildId,storageType),
      name: guildId,
      version: 0,
    });
  }
  return storageCaches[guildId];
};
