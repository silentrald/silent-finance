<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { inject, onMounted, ref } from "vue";
import { Repos } from '@/repos/consts';
import { Wallet } from "@/entities/wallet";
import WalletCard from '../components/wallet-card.vue';
import type { WalletRepo } from "@/repos/wallet/type";
import useLocale from '@/composables/locale';

const { t } = useLocale();

const walletRepo: WalletRepo | undefined = inject(Repos.WALLET);
const wallets = ref([] as Wallet[]);
const newWallet = ref({
  name: "",
  amount: "",
  color: "",
});

onMounted(async () => {
  if (!walletRepo) {
    return;
  }

  wallets.value = (await walletRepo.getAll()).getValue();
});

async function createWallet() {
  if (!walletRepo) {
    return;
  }

  await walletRepo.create({
    name: newWallet.value.name,
    amount: +newWallet.value.amount,
    color: newWallet.value.color,
  });

  wallets.value = (await walletRepo.getAll()).getValue();
}

async function updateWallet(newWallet: Wallet) {
  if (!walletRepo) {
    return;
  }

  await walletRepo.update(newWallet);
  wallets.value = (await walletRepo.getAll()).getValue();
}

async function removeWallet(walletId: number) {
  if (!walletRepo) {
    return;
  }

  await walletRepo.removeById(walletId);
  wallets.value = (await walletRepo.getAll()).getValue();
}
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ t("transaction.title") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t("transaction.title") }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div v-for="wallet in wallets" :key="wallet.id">
          <wallet-card :wallet="wallet"
            @update="updateWallet"
            @remove="removeWallet"
          />
        </div>

        <div>
          <input type="text" v-model="newWallet.name" placeholder="name" />
          <input type="text" v-model="newWallet.amount" placeholder="amount" />
          <input type="text" v-model="newWallet.color" placeholder="color" />
          <button @click="createWallet">
            {{ t("transaction.createTransaction") }}
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
