
#define SHA_DIGESTSIZE	20
#define SHA_BLOCKSIZE	64


void datatruncate
  (
   char*   d1,	 /* data to be truncated */
   char*   d2,	 /* truncated data */
   int	   len	 /* length in bytes to keep */
  );




void
hmac_sha1
(
 char*	  k,	 /* secret key */
 int	  lk,	 /* length of the key in bytes */
 char*	  d,	 /* data */
 int	  ld,	 /* length of data in bytes */
 char*	  out,	 /* output buffer, at least "t" bytes */
 int	  t
);

