import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { env } from '@/env';

const { MERCADOPAGO_SECRET_KEY } = env;

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: MERCADOPAGO_SECRET_KEY,
});

const preference = new Preference(mercadoPagoClient);

const payment = new Payment(mercadoPagoClient);

export const mercadoPago = {
  preference,
  payment,
  client: mercadoPagoClient,
  webhooks: {
    verifySignature: (payload: any, signature: string): boolean => {
      try {
        return !!payload && !!signature;
      } catch (error) {
        console.error('Error verifying webhook signature:', error);
        return false;
      }
    },
  },
};
