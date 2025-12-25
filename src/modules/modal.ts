import { PromiseResult, Result } from "@/types/result";
import { ComponentRef } from "@ionic/core";
import { modalController } from "@ionic/vue";

export enum ModalAction {
  CONFIRM = "confirm",
  CANCEL = "cancel",
  CLOSE = "close",
  ERROR = "error",
  BACKDROP = "backdrop", // When outside of the modal is clicked
}

export interface ModalReturn<T> {
  action: ModalAction;
  data: T;
}

export async function showModal<T = null>(
  component: ComponentRef,
  props?: any
): PromiseResult<ModalReturn<T>> {
  try {
    const modal = await modalController.create({
      component, componentProps: props,
      id: "sample",
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    return Result.Ok({
      action: role as ModalAction,
      data: data as T,
    });
  } catch (error: any) {
    return Result.Error({ code: "SHOW_MODAL", error });
  }
}

export async function showBottomModal<T>(
  component: ComponentRef,
  props?: any
): PromiseResult<ModalReturn<T>> {
  try {
    const modal = await modalController.create({
      component, componentProps: props,
      initialBreakpoint: 1,
      breakpoints: [ 0, 1 ],
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    return Result.Ok({
      action: role as ModalAction,
      data: data as T,
    });
  } catch (error: any) {
    return Result.Error({ code: "SHOW_MODAL", error });
  }
}
