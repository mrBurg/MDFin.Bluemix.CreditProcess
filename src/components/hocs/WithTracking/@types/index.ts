import { TrackingStore } from '@src/stores/TrackingStore';
import {
  EGlobalEvent,
  EWidgetEvent,
  EResourceEvents,
  EFocusEvents,
  ECommonEvents,
  ECSSAnimationEvents,
  ECSSTransitionEvents,
  EFormEvents,
  EKeyboardEvents,
  EMouseEvents,
  EUIEvents,
  ESelectionEvents,
  EDOMMutationEvents,
  ETouchEvents,
  ETrackingActions,
} from '@src/trackingConstants';
import { ReactElement } from 'react';

export type TEvents =
  | EGlobalEvent
  | EWidgetEvent
  | EResourceEvents
  | EFocusEvents
  | ECommonEvents
  | ECSSAnimationEvents
  | ECSSTransitionEvents
  | EFormEvents
  | EKeyboardEvents
  | EMouseEvents
  | EUIEvents
  | ESelectionEvents
  | EDOMMutationEvents
  | ETouchEvents
  | ETrackingActions;

export type TWithTrackingProps = {
  id: string;
  children: ReactElement;
  events: TEvents[];
  tracking?: boolean;
};

export type TWithTrackingPropsStore = {
  trackingStore: TrackingStore;
} & TWithTrackingProps;
