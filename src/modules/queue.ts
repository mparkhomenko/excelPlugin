import Queue from "bull";
import { config } from "@core/config";

const store = new Map<string, Queue.Queue<any>>();

/**
 * Создает новый instance и подлючаем к Redis
 *
 * @param name - название очереди
 */
const createInstance = (name: string) => {
  // TODO fix to session
  // const item = new Queue(name, `redis://${config.queue.domain.replace('http://', '')}:${config.queue.port}`);

  const item = new Queue(name, {
    redis: config.queue,
  });
  store.set(name, item);

  item.on("completed", (job: Queue.Job) => {
    job.remove();
  });
  return item;
};

/**
 * Создает новую очередь в Redis
 *
 * @param name - название очереди
 * @param process - как мы будем обрабатывать данные
 */
const add = (name: string, process: Queue.ProcessCallbackFunction<any>) => {
  const item = createInstance(name);

  item.process(process);

  return item;
};

const get = (name: string) => {
  return store.get(name);
};

const toQueue = (name: string, object: any) => {
  store.get(name)?.add(object, { removeOnFail: true });
};

/**
 * Не забудь закрыть очереди, при завершении приложения
 * Мне кажется они не должны весеть вечно
 * @param name название
 */
const remove = (name: string) => {
  store.get(name)?.close();
  store.delete(name);
};

export const queue = {
  add,
  get,
  toQueue,
  remove,
  createInstance,
};
