import { readdirSync, rmSync } from 'fs';
import cron from 'node-cron';

export const clearCache = () => cron.schedule('* * 4 * *', () => {
  readdirSync('./Public/DL').forEach((fileName: string) => rmSync(`./Public/DL/${fileName}`));
  readdirSync('./Public/files').forEach((fileName: string) => rmSync(`./Public/DL/${fileName}`));
});
