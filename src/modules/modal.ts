import { PromiseResult, Result } from "@/types/result";
import { ComponentRef } from "@ionic/core";
import { modalController } from "@ionic/vue";

export enum ModalAction {
  CONFIRM = "confirm",
  CANCEL = "cancel",
  CLOSE = "close",
}

export interface ModalReturn<T> {
  action: ModalAction;
  data: T;
}

export async function showModal<T>(
  component: ComponentRef
): PromiseResult<ModalReturn<T>> {
  try {
    const modal = await modalController.create({ component });
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
