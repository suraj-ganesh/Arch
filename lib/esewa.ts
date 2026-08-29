import crypto from 'crypto';
import { EsewaInitiatePayload } from './types';

// Standard eSewa Sandbox Credentials for Nepal
export const ESEWA_CONFIG = {
  merchantCode: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE || 'EPAYTEST',
  secretKey: process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q', // Official eSewa v2 sandbox secret key
  initiateUrl: process.env.NEXT_PUBLIC_ESEWA_INITIATE_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  statusCheckUrl: process.env.ESEWA_STATUS_CHECK_URL || 'https://uat.esewa.com.np/api/epay/transaction/status/'
};

/**
 * Generates HMAC-SHA256 signature required by eSewa ePay v2
 * Standard format: "total_amount,transaction_uuid,product_code"
 */
export function generateEsewaSignature(
  totalAmount: string,
  transactionUuid: string,
  productCode: string = ESEWA_CONFIG.merchantCode,
  secretKey: string = ESEWA_CONFIG.secretKey
): string {
  const dataToSign = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(dataToSign);
  return hmac.digest('base64');
}

/**
 * Prepares payload object for submitting eSewa payment form
 */
export function prepareEsewaPayload(params: {
  amount: number;
  orderId: string;
  baseUrl: string;
}): EsewaInitiatePayload {
  const formattedAmount = params.amount.toFixed(2);
  const transactionUuid = `${params.orderId}-${Date.now()}`;
  const signedFields = 'total_amount,transaction_uuid,product_code';
  
  const signature = generateEsewaSignature(
    formattedAmount,
    transactionUuid,
    ESEWA_CONFIG.merchantCode
  );

  return {
    amount: formattedAmount,
    tax_amount: '0',
    total_amount: formattedAmount,
    transaction_uuid: transactionUuid,
    product_code: ESEWA_CONFIG.merchantCode,
    product_service_charge: '0',
    product_delivery_charge: '0',
    success_url: `${params.baseUrl}/checkout/success`,
    failure_url: `${params.baseUrl}/checkout/failure`,
    signed_field_names: signedFields,
    signature: signature
  };
}

/**
 * Decodes base64 string response sent back by eSewa redirect
 */
export function decodeEsewaResponse(encodedData: string) {
  try {
    const decodedStr = Buffer.from(encodedData, 'base64').toString('utf-8');
    return JSON.parse(decodedStr);
  } catch (err) {
    console.error('Failed to decode eSewa response:', err);
    return null;
  }
}
