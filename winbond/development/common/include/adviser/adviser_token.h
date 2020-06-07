#ifndef __ADVISER_TOKEN_H__
#define __ADVISER_TOKEN_H__

#define		SESSION_TOKEN_STORE		"/var/session_token"
#define		SESSION_TOKEN_STORE_LOCK		"/var/session_token_lock"
#define		EXPIRY_TIMEOUT		(1800)	//in seconds
#define WEBTOKEN_COMM_PIPE              "/var/ActiveWebTokens"
#define WEBTOKEN_COMM_PIPE1              "/var/ActiveWebTokens1"
#define WEBTOKEN_SIZE			(32+4)

typedef struct
{
	int		Status;
	char		websession_token[WEBTOKEN_SIZE];
} __attribute__((packed)) websession_info_t;

/**
	@brief Creates a new token and stores it in the session token store
	@returns 0 on success and -1 on failure
*/
int		CreateToken(char *token/*OUT*/, unsigned int user_priv /*IN*/,char* user_name /*IN*/,char* client_ip /*IN*/);

/**
	@brief Validates a given token.
	@returns 0 on success and -1 on failure
*/
int		ValidateToken(char *token/*IN*/, unsigned int *p_user_priv /*OUT*/,unsigned char* user_name /*OUT*/,unsigned char* client_ip /*OUT*/);

/**
	@brief InvValidates a given token.
	@returns 0 on success and -1 on failure
*/
int		InValidateToken(char *token/*IN*/);

/**
	@brief Deletes the token temporarily from the session token store
	@returns 0 on success and returns -1 on failure
*/
int		DeleteToken(char *token/*IN*/);

#endif

