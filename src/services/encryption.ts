
import nacl from 'tweetnacl';
import { decodeBase64, encodeBase64, decodeUTF8, encodeUTF8 } from 'tweetnacl-util';

export const generateKeyPair = () => {
    return nacl.box.keyPair();
};

export const encryptContent = (content: string, recipientPublicKey: string, senderPrivateKey: Uint8Array) => {
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const messageUint8 = decodeUTF8(content);
    const recipientPubKeyUint8 = decodeBase64(recipientPublicKey);

    const encrypted = nacl.box(messageUint8, nonce, recipientPubKeyUint8, senderPrivateKey);

    return {
        content: encodeBase64(encrypted),
        nonce: encodeBase64(nonce)
    };
};

export const decryptContent = (encryptedData: string, nonce: string, senderPublicKey: string, recipientPrivateKey: Uint8Array) => {
    try {
        const encryptedUint8 = decodeBase64(encryptedData);
        const nonceUint8 = decodeBase64(nonce);
        const senderPubKeyUint8 = decodeBase64(senderPublicKey);

        const decrypted = nacl.box.open(encryptedUint8, nonceUint8, senderPubKeyUint8, recipientPrivateKey);

        if (!decrypted) {
            throw new Error('Could not decrypt message');
        }

        return encodeUTF8(decrypted);
    } catch (e) {
        console.error('Decryption error:', e);
        return '[De-cryption Error: Secure Relay Integrity Compromised]';
    }
};
