
#ifndef __BLOWFISH_H__
#define __BLOWFISH_H__


//To get proper user defined sizes.
#define REQ_ENCRYPT_BUFF_SIZE( X )  (X % 8)  != 0 ? X + ( 8 - ( X % 8 )): X
#define REQ_DECRYPT_BUFF_SIZE( X )  X

typedef void * BFHANDLE;

BFHANDLE blowfishInit(  unsigned char *key, int keyLen);
int blowfishEncryptPacket(char *inBuf, unsigned int  sizeInBuf, char *outBuf, unsigned int sizeOutBuf, BFHANDLE );
int blowfishDecryptPacket( char *packet, int packLen,BFHANDLE );
void blowfishClose(BFHANDLE ctx );
unsigned long rotateLong(unsigned long dWord);

#endif // __BLOWFISH_H__



