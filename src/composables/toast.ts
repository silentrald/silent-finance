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
      logger.error(error);

      let toastMessage = t(`errors.${error.code}`, (error as any).data);
      if (message) {
        toastMessage = `${message} ${toastMessage}`;
      }

      try {
        const toast = await toastController.create({
          message: toastMessage,
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

    errorCode: async ({ code, data }: {
      code: ErrorCodes;
      data?: Record<string, any>;
    }): Promise<void> => {
      logger.error("Error ", code);

      try {
        const toast = await toastController.create({
          message: t(`errors.${code}`, data || {}),
          position: "bottom",
          buttons: [
            { text: "X" },
          ],
        });
        await toast.present();
      } catch (error: any) {
        logger.error("Could not show error code toast", error);
      }
    },
  }
}

