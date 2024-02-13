import { UserStore } from '@src/stores/UserStore';

export type TGoalpageFrame = unknown;

export type TGoalpageFrameStore = { userStore: UserStore } & TGoalpageFrame;
