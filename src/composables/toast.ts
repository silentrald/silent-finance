import { ErrorCodes } from "@/types/error";
import { ResultError } from "@/types/result";
import logger from "@/modules/logger";
import { toastController } from "@ionic/vue";
import { useI18n } from "vue-i18n";

export default function useToast() {
  const { t } = useI18n();

  return {
    show: async ({
      message,
      duration,
    }: {
      message: string;
      duration?: number;
    }): Promise<void> => {
      try {
        const toast = await toastController.create({
          message, duration,
        });

        await toast.present();
      } catch (error: any) {
        logger.error("Could not show toast", error);
      }
    },

    error: async <E extends ErrorCodes>({
      error,
      message,
    }: {
      error: ResultError<E>
      message?: string;
    }): Promise<void> => {
      if (message) {
        logger.error(message, " ", error);
      } else {
        logger.error(error);
      }

      try {
        const toast = await toastController.create({
          message: t(`errors.${error.code}`, (error as any).data),
          position: "bottom",
          buttons: [
            { text: "X" },
          ],
        });
        await toast.present();
      } catch (error: any) {
        logger.error("Could not show error toast", error);
      }
    },
  }
}

